# React Transition Hooks

The goal of this component is supply a better alternative to [ReactTransitionGroup](https://facebook.github.io/react/docs/animation.html). Why? Because, ReactTransitionGroup animations can not be interrupted. So, if you are with a component entering the group it can not leave until the entering phase is complete. Plus, Facebook will drop support for ReactTransitionGroup soon.

If you have a component currently using ReactTransitionGroup you can just change your import with this component and everything should work as expected.

[Demo using ReactInlineTransitionGroup](http://felipethome.github.io/react-inline-transition-group/demo/index.html)

# How to install

    npm install react-transition-hooks

## Hooks

This component uses the same API names of ReactTransitionGroup. 

- **componentWillAppear(callback)**: Called right after componentDidMount. This is called for the children inside the group for the first render. After the first render this will never be called again.

- **componentDidAppear()**: Called when the callback passed to componentWillAppear is called.

- **componentWillEnter(callback)**: Called when a component just entered the group.

- **componentDidEnter()**: Called when the callback passed to componentWillEnter is called.

- **componentWillLeave(callback)**: Called when a component is leaving the group.

- **componentDidLeave()**: Called when the callback passed to componentWillLeave is called. This is called right after componentWillUnmount.

## Properties

Property name | Description
------------ | -------------
component | The component that will wrap all the children. Default: span

## LICENSE

BSD-3