---
title: "How to start"
weight: 10
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

`<script src="https://unpkg.com/@livechat/chat.io-customer-sdk@0.1.2/dist/chat.io-customer-sdk.min.js"></script>`

If you just want to look around and play with the SDK, check out our [sample chat widget implementation](https://codesandbox.io/s/rm3prxw88n).

## Use API

Now run the init function with configuration, replacing `LICENSE_NUMBER` with your chat.io license number. The function will return the customerSDK instance:

```js
const customerSDK = chatIoCustomerSDK.init({
    license: LICENSE_NUMBER,
})
```

With `customerSDK`, you can attach [callbacks](#callbacks):

```js
customerSDK.on('new_event', newEvent => {
    console.log(newEvent)
})
```

or execute [methods](#methods):

```js
const chatId = 'OU0V0P0OWT'
customerSDK.sendMessage(chatId, {
    text: 'Hi!',
})
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
```


