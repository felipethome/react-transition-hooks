var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var CallbackStore = require('./CallbackStore');
var findIndex = require('./findIndex');

var TransitionHooks = createReactClass({
  displayName: 'TransitionHooks',

  propTypes: {
    children: PropTypes.node,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
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
    this._CallbackStore = new CallbackStore();
  },

  componentDidMount: function () {
    this._performAppear();
  },

  componentWillReceiveProps: function (nextProps) {
    // currentChildren are children that are already inside the component or,
    // in other words, the ones in the state.
    var currentChildren = {};

    // nextChildren are children that are present in the nextProps.children.
    var nextChildren = {};

    React.Children.toArray(nextProps.children).forEach(function (nextChild) {
      nextChildren[nextChild.key] = nextChild;
    });

    // updatedCurrentChildren are children that are already inside the
    // component, but updated using the children in nextProps.children.
    var updatedCurrentChildren = [];

    this.state.children.forEach(function (prevChild) {
      currentChildren[prevChild.key] = prevChild;

      if (nextChildren[prevChild.key]) {
        updatedCurrentChildren.push(nextChildren[prevChild.key]);
      }
      else {
        updatedCurrentChildren.push(prevChild);
      }
    });

    this.setState({
      children: updatedCurrentChildren,
    });

    // Notice performEnter() calls performLeave(). This way I can guarantee
    // the leaving process starts after the entering process. This is good
    // for tests and for the user.
    this._performEnter(currentChildren, nextChildren);
  },

  componentWillUnmount: function () {
    this._CallbackStore.cancelAll();
  },

  _triggerInitialHook: function (initialHook, callbackFactory, key) {
    // Cancel the callback of the previous animation
    this._CallbackStore.cancel(key);

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

    return this._CallbackStore.make(callback, key, this);
  },

  _performEnter: function (currentChildren, nextChildren) {
    var enteringChildrenKeys = {};

    this.setState(function (previousState) {
      var newChildren = previousState.children.slice();

      Object.keys(nextChildren).forEach(function (key, i) {
        if (typeof currentChildren[key] === 'undefined') {
          newChildren.splice(i, 0, nextChildren[key]);
          enteringChildrenKeys[key] = true;
        }

        // In case the child was leaving, but now is entering
        if (this._prevLeavingChildren[key]) {
          delete this._prevLeavingChildren[key];
          enteringChildrenKeys[key] = true;
        }
      }, this);

      return {
        children: newChildren,
      };
    }, function () {
      Object.keys(enteringChildrenKeys).forEach(function (key) {
        this._triggerInitialHook(
          this._components[key].componentWillEnter,
          this._doneEnteringCallbackFactory,
          key
        );
      }, this);

      this._performLeave(currentChildren, nextChildren);
    });
  },

  _doneEnteringCallbackFactory: function (key) {
    var component = this._components[key];

    var callback = function () {
      if (component.componentDidEnter) {
        component.componentDidEnter();
      }
    };

    return this._CallbackStore.make(callback, key, this);
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
        var position = findIndex(newChildren, function (element) {
          if (element.key === key) return true;
        });
        if (position >= 0) newChildren.splice(position, 1);

        return {
          children: newChildren,
        };
      }, function () {
        if (component.componentDidLeave) {
          component.componentDidLeave();
        }
      });
    };

    return this._CallbackStore.make(callback, key, this);
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

module.exports = TransitionHooks;
