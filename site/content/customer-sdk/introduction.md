---
weight: 10
---

# Introduction

chat.io Customer JS SDK allows you to manage multiple chats via chat.io as a
customer using JavaScript.

You can use this to create your own chat widget.

## Is it for me?

If you need to customize the chat.io widget, using chat.io Customer JS SDK is
one of the options to do this. If you need a fully custom solution and you feel
brave, dive into chat.io Customer JS SDK: we provide [methods](#methods) and
[events](#events) for deep integration with the chat.io environment.

Keep in mind, however, that interacting with this API requires **some
development skills**.

## About chat.io Customer JS SDK

We provide an asynchronous API, where most methods interacting with a server
return promises. To get promise fulfillment result, subscribe your handler to
the promise's
[`then()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
method. More about promises can be found
[here](https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Promise).
You can also subscribe to emitted events with `on` and `off` methods.

We authenticate your sessions by using
[chat.io-customer-auth package](https://www.npmjs.com/package/@livechat/chat.io-customer-auth)
and expose the created `auth` object on the returned SDK's instance. In general
you don't have to worry about it nor use the exposed object, but if you need to
get the authentication token you can get it through the SDK like this:

```js
customerSDK.auth.getToken().then(token => console.log(token))
```

## Examples

* [A sample chat widget implementation](https://codesandbox.io/s/rm3prxw88n)
