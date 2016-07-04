var React = require('react');
var CallbackStore = require('./CallbackStore');

var TransitionGroup = React.createClass({
  displayName: 'TransitionGroup',

  propTypes: {
    children: React.PropTypes.node,
    component: React.PropTypes.string,
  },

  getDefaultProps: function () {
    return {
      component: 'span',
    };
  },

  getInitialState: function () {
    return {
      // React.Children.toArray will return an array with the keys
      children: React.Children.toArray(this.props.children),
    };
  },

  componentWillMount: function () {
    this._components = {};
    this._prevLeavingChildren = {};
  },

  componentDidMount: function () {
    this._performAppear();
  },

  componentWillReceiveProps: function (nextProps) {
    var currentChildren = {};
    var nextChildren = {};

    this.state.children.forEach(function (prevChild) {
      currentChildren[prevChild.key] = prevChild;
    });

    React.Children.toArray(nextProps.children).forEach(function (nextChild) {
      nextChildren[nextChild.key] = nextChild;
    });

    this._performEnter(currentChildren, nextChildren);
    this._performLeave(currentChildren, nextChildren);
  },

  componentWillUnmount: function () {
    CallbackStore.cancelAll();
  },

  _triggerInitialHook: function (initialHook, callbackFactory, key) {
    // Cancel the callback of the previous animation
    CallbackStore.cancel(key);

    var callback = callbackFactory(key);

    if (initialHook) {
      initialHook(callback);
    }
    else {
      callback();
    }
  },

  _performAppear: function () {
    this.state.children.forEach(function (child) {
      this._triggerInitialHook(
        this._components[child.key].componentWillAppear,
        this._doneAppearingCallbackFactory,
        child.key
      );
    }, this);
  },

  _doneAppearingCallbackFactory: function (key) {
    var component = this._components[key];

    var callback = function () {
      if (component.componentDidAppear) {
        component.componentDidAppear();
      }
    };

    return CallbackStore.make(callback, key, this);
  },

  _performEnter: function (currentChildren, nextChildren) {
    var enteringChildrenKeys = [];

    this.setState(function (previousState) {
      var newChildren = previousState.children.slice();

      Object.keys(nextChildren).forEach(function (key, i) {
        if (typeof currentChildren[key] === 'undefined') {
          // In case the child was leaving, but now is entering
          if (this._prevLeavingChildren[key]) {
            delete this._prevLeavingChildren;
          }
          newChildren.splice(i, 0, nextChildren[key]);
          enteringChildrenKeys.push(key);
        }
      }, this);

      return {
        children: newChildren,
      };
    }, function () {
      enteringChildrenKeys.forEach(function (key) {
        this._triggerInitialHook(
          this._components[key].componentWillEnter,
          this._doneEnteringCallbackFactory,
          key
        );
      }, this);
    });
  },

  _doneEnteringCallbackFactory: function (key) {
    var component = this._components[key];

    var callback = function () {
      if (component.componentDidEnter) {
        component.componentDidEnter();
      }
    };

    return CallbackStore.make(callback, key, this);
  },

  _performLeave: function (currentChildren, nextChildren) {
    var leavingChildren = {};

    Object.keys(currentChildren).forEach(function (key) {
      if (typeof nextChildren[key] === 'undefined') {
        if (!this._prevLeavingChildren[key]) {
          this._triggerInitialHook(
            this._components[key].componentWillLeave,
            this._doneLeavingCallbackFactory,
            key
          );
        }
        leavingChildren[key] = true;
      }
    }, this);

    // Since the child removal will be postponed we need this variable to
    // guarantee we are not trying to remove a child that is already in the
    // process of being removed
    this._prevLeavingChildren = leavingChildren;
  },

  _doneLeavingCallbackFactory: function (key) {
    var component = this._components[key];

    var callback = function () {
      // Mark the child leaving process as complete
      if (this._prevLeavingChildren[key]) {
        delete this._prevLeavingChildren[key];
      }

      this.setState(function (previousState) {
        var newChildren = previousState.children.slice();
        var position = newChildren.findIndex(function (element) {
          if (element.key === key) return true;
        });
        newChildren.splice(position, 1);

        return {
          children: newChildren,
        };
      }, function () {
        if (component.componentDidLeave) {
          component.componentDidLeave();
        }
      });
    };

    return CallbackStore.make(callback, key, this);
  },

  _storeComponent: function (key, component) {
    if (component) {
      this._components[key] = component;
    }
    else {
      delete this._components[key];
    }
  },

  render: function () {
    var filteredProps = Object.assign({}, this.props);
    delete filteredProps.component;

    var children = this.state.children.map(function (child) {
      return React.cloneElement(
        child, {ref: this._storeComponent.bind(this, child.key)}
      );
    }, this);

    return React.createElement(
      this.props.component, filteredProps, children
    );
  },

});

module.exports = TransitionGroup;