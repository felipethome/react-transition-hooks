/* eslint-disable react/no-multi-comp, react/prop-types, react/display-name */

jest.unmock('../TransitionHooks');

var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');
var TransitionGroup = require('../TransitionHooks');

describe('TransitionGroup', function () {

  it('should handle appear/leave/enter correctly', function () {
    var log = [];

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount');
      },
      componentWillUnmount: function () {
        log.push('willUnmount');
      },
      componentWillAppear: function (cb) {
        log.push('willAppear');
        cb();
      },
      componentDidAppear: function () {
        log.push('didAppear');
      },
      componentWillEnter: function (cb) {
        log.push('willEnter');
        cb();
      },
      componentDidEnter: function () {
        log.push('didEnter');
      },
      componentWillLeave: function (cb) {
        log.push('willLeave');
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave');
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {count: 1};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount', 'willAppear', 'didAppear']);

    log = [];
    instance.setState({count: 0});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);

    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['didMount', 'willEnter', 'didEnter']);
  });

  it('should handle appear/enter/leave correctly', function () {
    var log = [];

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount');
      },
      componentWillUnmount: function () {
        log.push('willUnmount');
      },
      componentWillAppear: function (cb) {
        log.push('willAppear');
        cb();
      },
      componentDidAppear: function () {
        log.push('didAppear');
      },
      componentWillEnter: function (cb) {
        log.push('willEnter');
        cb();
      },
      componentDidEnter: function () {
        log.push('didEnter');
      },
      componentWillLeave: function (cb) {
        log.push('willLeave');
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave');
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {count: 1};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount', 'willAppear', 'didAppear']);

    log = [];
    instance.setState({count: 2});
    expect(log).toEqual(['didMount', 'willEnter', 'didEnter']);

    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);
  });

  it('should handle enter/leave/enter/leave correctly', function () {
    var log = [];
    var willEnterCb;

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount');
      },
      componentWillUnmount: function () {
        log.push('willUnmount');
      },
      componentWillEnter: function (cb) {
        log.push('willEnter');
        willEnterCb = cb;
      },
      componentDidEnter: function () {
        log.push('didEnter');
      },
      componentWillLeave: function (cb) {
        log.push('willLeave');
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave');
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {count: 1};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount']);
    instance.setState({count: 2});
    expect(log).toEqual(['didMount', 'didMount', 'willEnter']);

    // Animations must not be blocked
    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);

    // This callback must be canceled and therefore not produce any effect
    willEnterCb();
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);

  });

  it('should handle enter/leave/enter correctly', function () {
    var log = [];
    var willEnterCb;

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount');
      },
      componentWillUnmount: function () {
        log.push('willUnmount');
      },
      componentWillEnter: function (cb) {
        log.push('willEnter');
        willEnterCb = cb;
      },
      componentDidEnter: function () {
        log.push('didEnter');
      },
      componentWillLeave: function (cb) {
        log.push('willLeave');
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave');
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {count: 1};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount']);

    instance.setState({count: 2});
    expect(log).toEqual(['didMount', 'didMount', 'willEnter']);

    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);

    log = [];
    instance.setState({count: 2});
    willEnterCb();
    expect(log).toEqual(['didMount', 'willEnter', 'didEnter']);
  });

  it('should handle entering/leaving several elements at once', function () {
    var log = [];

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount' + this.props.id);
      },
      componentWillUnmount: function () {
        log.push('willUnmount' + this.props.id);
      },
      componentWillEnter: function (cb) {
        log.push('willEnter' + this.props.id);
        cb();
      },
      componentDidEnter: function () {
        log.push('didEnter' + this.props.id);
      },
      componentWillLeave: function (cb) {
        log.push('willLeave' + this.props.id);
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave' + this.props.id);
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {count: 1};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} id={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount0']);

    log = [];
    instance.setState({count: 3});
    expect(log).toEqual([
      'didMount1', 'didMount2',
      'willEnter1', 'didEnter1',
      'willEnter2', 'didEnter2',
    ]);

    log = [];
    instance.setState({count: 0});
    expect(log).toEqual([
      'willLeave0', 'willLeave1', 'willLeave2',
      'willUnmount0', 'willUnmount1', 'willUnmount2',
      'didLeave0', 'didLeave1', 'didLeave2',
    ]);
  });

  it('should handle enter and leave at the same time correctly', function () {
    var log = [];

    var Child = createReactClass({
      componentDidMount: function () {
        log.push('didMount' + this.props.id);
      },
      componentWillUnmount: function () {
        log.push('willUnmount' + this.props.id);
      },
      componentWillEnter: function (cb) {
        log.push('willEnter' + this.props.id);
        cb();
      },
      componentDidEnter: function () {
        log.push('didEnter' + this.props.id);
      },
      componentWillLeave: function (cb) {
        log.push('willLeave' + this.props.id);
        cb();
      },
      componentDidLeave: function () {
        log.push('didLeave' + this.props.id);
      },
      render: function () {
        return <span />;
      },
    });

    var Component = createReactClass({
      getInitialState: function () {
        return {elements: [0, 1]};
      },
      render: function () {
        var children = [];
        for (var i = 0; i < this.state.elements.length; i++) {
          children.push(
            <Child key={this.state.elements[i]} id={this.state.elements[i]} />
          );
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      },
    });

    var container = document.createElement('div');
    var instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount0', 'didMount1']);

    log = [];
    instance.setState({elements: [2]});
    expect(log).toEqual([
      'didMount2', 'willEnter2', 'didEnter2',
      'willLeave0', 'willLeave1',
      'willUnmount0', 'willUnmount1',
      'didLeave0', 'didLeave1',
    ]);
  });

});
