# Hyperapp-like native view demo

based on code generated by `react-native init`

by Christopher J. Brody aka @brodybits (Chris Brody)

LICENSE: ISC OR MIT

## About

Simple counter app demo with state/action management system based on [Hyperapp](https://github.com/jorgebucaran/hyperapp) API, working on React Native and [`react-native-web`](https://github.com/necolas/react-native-web#readme). Inspired by Hyperapp demo in <https://github.com/hyperapp/hyperapp#getting-started>.

MOTIVATION:

- <https://github.com/hyperapp/hyperapp/issues/168> - desire to use Hyperapp API on React Native
- <https://medium.com/hyperapp/hyperapp-for-redux-refugees-2507c9dd1ddc>
- <https://github.com/hyperapp/hyperapp/issues/641> (desire to use Superfine as a dependency), especially rejected idea in <https://github.com/hyperapp/hyperapp/issues/641#issuecomment-376445893> (remove VDOM from Hyperapp)
- <https://github.com/hyperapp/hyperapp/issues/672> (desire to experiment with Hyperapp 2.0 API on React Native as well)

See also: <https://github.com/brodybits/hyperapp-rewrite-demo-on-inferno-and-superfine> - demo rewrite of Hyperapp state/action management working with functional (stateless) components on multiple VDOM APIs: Inferno (React API) and Superfine

NOTE: This project no longer conforms to the Hyperapp API for specifying actions and views. Version with partial conformance to Hyperapp 1.x API is available in the [`strict-api-1` branch](https://github.com/brodybits/hyperapp-like-native-view-demo/tree/strict-api-1).

## Build and run

First step: `npm install`

Android: `react-native run-android`

iOS: `react-native run-ios` or open [`ios/HyperappLikeNativeViewDemo.xcodeproj`](./ios/HyperappLikeNativeViewDemo.xcodeproj) and run from Xcode

## Run on codesandbox.io

(using [`react-native-web`](https://www.npmjs.com/package/react-native-web))

Paste the contents of [`App.js`](./App.js) into `App.js` in <https://codesandbox.io/s/q4qymyp2l6>

(see [`react-native-web#quick-start`](https://github.com/necolas/react-native-web#quick-start))

## Quick tour

### Top-level

React Native App with initial state, actions, effects (side effects such as I/O, timers, I/O, other asynchronous operations, and other non-pure functions), and view in JSX (partially inspired by Hyperapp demo app in <https://github.com/hyperapp/hyperapp#getting-started>):

```jsx
const App = () => (
  <ManagedAppView
    state={{count: 0}}
    actions={{
      up: (state) => ({ count: state.count + 1 }),
      dn: (state) => ({ count: state.count - 1 }),
    }}
    effects = {{
      delayedUpAndDn: (actions, effects) => {
        setTimeout(effects.upAndDn, 500)
      },
      upAndDn: (actions, effects) => {
        actions.up()
        setTimeout(actions.dn, 500)
      }
    }}>
    <MyAppView />
  </ManagedAppView>
)

const MyAppView = ({state, actions, effects}) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Hyperapp micro rewrite demo on React Native
    </Text>
    <MyTouchButton
      style={styles.mybutton}
      onPress={actions.up}
      title="Up (+1)"
    />
    <Text style={styles.welcome}>
      {state.count}
    </Text>
    <MyTouchButton
      style={styles.mybutton}
      onPress={actions.dn}
      title="Down (-1)"
    />
    <Text>
      ...
    </Text>
    <MyTouchButton
      style={styles.mybutton}
      onPress={effects.delayedUpAndDn}
      title="Up and down with delay"
    />
  </View>
)

export default App
```

### Generic ManagedAppView component

Generic `ManagedAppView` component that supports the Hyperapp action/state/view API:

```js
const ManagedAppView = createReactClass({
  getInitialState() {
    const ac = {}
    const ef = {}
    const self = this
    for (let a in this.props.actions) ac[a] = () => {
      self.setState(prev => ({ac: ac, st: (this.props.actions[a](prev.st))}))
    }
    for (let e in this.props.effects) ef[e] = () => {
      this.props.effects[e](ac, ef)
    }
    return {ac: ac, st: this.props.state, ef: ef}
  },
  render() {
    return React.Children.map(this.props.children, ch => (
      React.cloneElement(ch, {state: this.state.st, actions: this.state.ac, effects: this.state.ef})
    ))
  }
})
```

### MyTouchButton component

Functional `MyTouchButton` component using `TouchableHighlight` for easier portability to [`react-primitives`](https://github.com/lelandrichardson/react-primitives#readme):

```js
const MyTouchButton = (props) => {
  const { title, ...other } = props

  return (
    <TouchableHighlight {...other}>
      <Text>{title}</Text>
    </TouchableHighlight>
  )
}
```

### Demo styles

Demo styles with help from `react-native init` and guidance in <https://facebook.github.io/react-native/docs/touchablehighlight>:

```js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mybutton: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
```

## TODO

### Urgent

- Press-button visual behavior needs improvement on Android and iOS mobile platforms

### Near-term

- Integrate build and run on browser using [`react-native-web`](https://github.com/necolas/react-native-web) ([#1](https://github.com/brodybits/hyperapp-like-native-view-demo/issues/1))

### Future

- [(BREAKING) View API changes from "Hyperapp 2.0", hopefully closer to standard functional component API (brodybits/hyperapp-rewrite-demo-on-inferno-and-superfine#5)](https://github.com/brodybits/hyperapp-rewrite-demo-on-inferno-and-superfine/issues/5)
- Pass event data to action and effect functions
- [Make this even more functional (#7)](https://github.com/brodybits/hyperapp-like-native-view-demo/issues/7) ref: <https://www.bignerdranch.com/blog/destroy-all-classes-turn-react-components-inside-out-with-functional-programming/>
- Publish generic (common) functionality in one or more npm packages
- improve styling
- [CC0 (public domain) API specification (brodybits/hyperapp-rewrite-demo-on-inferno-and-superfine#1)](https://github.com/brodybits/hyperapp-rewrite-demo-on-inferno-and-superfine/issues/1)
- demo on <https://github.com/dabbott/react-native-web-player>
- TodoMVC app, likely based on <https://github.com/dangvanthanh/hyperapp-todomvc>
- [other open issues](https://github.com/brodybits/hyperapp-like-native-view-demo/issues)
