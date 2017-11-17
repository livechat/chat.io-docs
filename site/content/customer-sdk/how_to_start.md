---
title: "How to start"
weight: 20
---

# How to start

## Install Customer JS SDK

You can use chat.io Customer JS SDK in two different ways:

#### Using npm

`npm install --save @livechat/chat.io-customer-sdk`

Now, you can import SDK in your code:

`import chatIoCustomerSDK from '@livechat/chat.io-customer-sdk'`

or with node-style `require` call:

`const chatIoCustomerSDK = require('@livechat/chat.io-customer-sdk')`

#### Using script tag - UMD module hosted on unpkg's CDN

`<script
src="https://unpkg.com/@livechat/chat.io-customer-sdk@0.3.1/dist/chat.io-customer-sdk.min.js"></script>`

If you just want to look around and play with the SDK, check out our
[sample chat widget implementation](https://codesandbox.io/s/rm3prxw88n).

#### Using in React Native

We authenticate your sessions with cookies and we need some sort of browser
environment for that. We've prepared a special wrapper for you to use in React
Native, which opens a WebView component to get an authentication token. All you
have to do is to import it from our authentication package (no need to install
it, SDK depends on it - so you have it installed already) and mount it in your
React Native application:

```js
import { AuthWebView } from '@livechat/chat.io-customer-auth'
import { init } from '@livechat/chat.io-customer-sdk'

export default class App extends React.Component {
  license = LICENSE_NUMBER

  componentDidMount() {
    const customerSDK = init({ license: this.license })
    // you can start using customerSDK from now
  }

  render() {
    return (
      <View>
        <AuthWebView license={this.license} />
      </View>
    )
  }
}
```

## Use API

Now run the init function with configuration, replacing `LICENSE_NUMBER` with
your chat.io license number. The function will return the customerSDK instance:

```js
const customerSDK = chatIoCustomerSDK.init({
  license: LICENSE_NUMBER,
})
```

With `customerSDK`, you can attach [events](#events):

```js
customerSDK.on('new_event', newEvent => {
  console.log(newEvent)
})
```

or execute [methods](#methods):

```js
const chatId = 'OU0V0P0OWT'
customerSDK
  .sendMessage(chatId, {
    text: 'Hi!',
  })
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  })
```
