/**
 * Hyperapp micro rewrite demo on React Native
 *
 * based on code generated by react-native init
 *
 * https://github.com/facebook/react-native
 *
 * @flow
 */

import React from 'react'

import createReactClass from 'create-react-class'

import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native'

const initState = {count: 0}

const actions = {
    up: (state) => ({ count: state.count + 1 }),
    dn: (state) => ({ count: state.count - 1 }),
}

const MyView =
  ({state, actions}) => {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hyperapp micro rewrite demo on React Native
        </Text>
        <Button
          onPress={actions.up}
          title="Up (+1)"
        />
        <Text style={styles.welcome}>
          {state.count}
        </Text>
        <Button
          onPress={actions.dn}
          title="Down (-1)"
        />
      </View>
    )
  }

const App = () => (
  <ManagedView state={initState} actions={actions}>
    <MyView />
  </ManagedView>
)

export default App

const ManagedView = createReactClass({
  getInitialState() {
    const ac = {}
    const self = this
    for (let a in this.props.actions) ac[a] = () => {
      self.setState(prev => ({ac: ac, st: (this.props.actions[a](prev.st))}))
    }
    return {ac: ac, st: this.props.state}
  },
  render() {
    return React.Children.map(this.props.children, ch => (
      React.cloneElement(ch, {state: this.state.st, actions: this.state.ac})
    ))
  }
})

// from react-native init:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
