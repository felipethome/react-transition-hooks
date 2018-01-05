/* eslint-disable react/no-multi-comp, react/prop-types, react/display-name */

jest.unmock('../TransitionHooks');

const installMockRAF = require('./installMockRAF');
installMockRAF();

const React = require('react');
const ReactDOM = require('react-dom');
const TransitionGroup = require('../TransitionHooks');

describe('TransitionGroup', function () {
  it('should handle appear/leave/enter correctly', function () {
    let log = [];

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount');
      }
      componentWillUnmount() {
        log.push('willUnmount');
      }
      componentWillAppear(cb) {
        log.push('willAppear');
        cb();
      }
      componentDidAppear() {
        log.push('didAppear');
      }
      componentWillEnter(cb) {
        log.push('willEnter');
        cb();
      }
      componentDidEnter() {
        log.push('didEnter');
      }
      componentWillLeave(cb) {
        log.push('willLeave');
        cb();
      }
      componentDidLeave() {
        log.push('didLeave');
      }
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {count: 1};

      render() {
        const children = [];
        for (let i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount', 'willAppear', 'didAppear']);

    log = [];
    instance.setState({count: 0});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);

    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['didMount', 'willEnter', 'didEnter']);
  });

  it('should handle appear/enter/leave correctly', function () {
    let log = [];

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount');
      }
      componentWillUnmount() {
        log.push('willUnmount');
      }
      componentWillAppear(cb) {
        log.push('willAppear');
        cb();
      }
      componentDidAppear() {
        log.push('didAppear');
      }
      componentWillEnter(cb) {
        log.push('willEnter');
        cb();
      }
      componentDidEnter() {
        log.push('didEnter');
      }
      componentWillLeave(cb) {
        log.push('willLeave');
        cb();
      }
      componentDidLeave() {
        log.push('didLeave');
      }
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {count: 1};

      render() {
        const children = [];
        for (let i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

    expect(log).toEqual(['didMount', 'willAppear', 'didAppear']);

    log = [];
    instance.setState({count: 2});
    expect(log).toEqual(['didMount', 'willEnter', 'didEnter']);

    log = [];
    instance.setState({count: 1});
    expect(log).toEqual(['willLeave', 'willUnmount', 'didLeave']);
  });

  it('should handle enter/leave/enter/leave correctly', function () {
    let log = [];
    let willEnterCb;

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount');
      }
      componentWillUnmount() {
        log.push('willUnmount');
      }
      componentWillEnter(cb) {
        log.push('willEnter');
        willEnterCb = cb;
      }
      componentDidEnter() {
        log.push('didEnter');
      }
      componentWillLeave(cb) {
        log.push('willLeave');
        cb();
      }
      componentDidLeave() {
        log.push('didLeave');
      }
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {count: 1};

      render() {
        const children = [];
        for (let i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

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
    let log = [];
    let willEnterCb;

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount');
      }
      componentWillUnmount() {
        log.push('willUnmount');
      }
      componentWillEnter(cb) {
        log.push('willEnter');
        willEnterCb = cb;
      }
      componentDidEnter() {
        log.push('didEnter');
      }
      componentWillLeave(cb) {
        log.push('willLeave');
        cb();
      }
      componentDidLeave() {
        log.push('didLeave');
      }
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {count: 1};

      render() {
        const children = [];
        for (let i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

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
    let log = [];

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount' + this.props.id);
      }
      componentWillUnmount() {
        log.push('willUnmount' + this.props.id);
      }
      componentWillEnter = (cb) => {
        log.push('willEnter' + this.props.id);
        cb();
      };
      componentDidEnter = () => {
        log.push('didEnter' + this.props.id);
      };
      componentWillLeave = (cb) => {
        log.push('willLeave' + this.props.id);
        cb();
      };
      componentDidLeave = () => {
        log.push('didLeave' + this.props.id);
      };
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {count: 1};

      render() {
        const children = [];
        for (let i = 0; i < this.state.count; i++) {
          children.push(<Child key={i} id={i} />);
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

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
    let log = [];

    class Child extends React.Component {
      componentDidMount() {
        log.push('didMount' + this.props.id);
      }
      componentWillUnmount() {
        log.push('willUnmount' + this.props.id);
      }
      componentWillEnter = (cb) => {
        log.push('willEnter' + this.props.id);
        cb();
      };
      componentDidEnter = () => {
        log.push('didEnter' + this.props.id);
      };
      componentWillLeave = (cb) => {
        log.push('willLeave' + this.props.id);
        cb();
      };
      componentDidLeave = () => {
        log.push('didLeave' + this.props.id);
      };
      render() {
        return <span />;
      }
    }

    class Component extends React.Component {
      state = {elements: [0, 1]};

      render() {
        const children = [];
        for (let i = 0; i < this.state.elements.length; i++) {
          children.push(
            <Child key={this.state.elements[i]} id={this.state.elements[i]} />
          );
        }
        return <TransitionGroup>{children}</TransitionGroup>;
      }
    }

    const container = document.createElement('div');
    const instance = ReactDOM.render(<Component />, container);

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
