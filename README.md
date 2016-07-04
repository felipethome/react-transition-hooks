# React Transition Hooks

The goal of this component is supply a better alternative to ReactTransitionGroup. Why? Because, ReactTransitionGroup animations can not be interrupted. So, if you are with an animation going on and you want to interrupt it and begin another one you will need to wait until the current animation finishes. Plus, Facebook will drop support for ReactTransitionGroup soon.

If you have a component currently using ReactTransitionGroup you can just change your import with this component and everything should work as expected.

# How to install

    npm install react-transition-hooks

## Hooks

- **componentWillAppear**:

- **componentDidAppear**:

- **componentWillEnter**:

- **componentDidEnter**:

- **componentWillLeave**:

- **componentDidLeave**:

## Properties

Property name | Description
------------ | -------------
component | The component that will wrap all the children. Default: div

## LICENSE

BSD-3