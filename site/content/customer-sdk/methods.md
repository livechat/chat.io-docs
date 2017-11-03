---
title: "Methods"
weight: 30
---

# Methods

## closeThread
```js
customerSDK.closeThread("ON0X0R0L67")
    .then(response => {
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
```

Arguments:

| arguments | type   | description                                   |
| --------- | ------ | --------------------------------------------- |
| chat      | string | Chat's id in which thread should get closed   |

Returned value:

| shape     | type             |
| --------- | ---------------- |
| success   | boolean          |

## disconnect
```js
customerSDK.disconnect()
```

## getChatHistory

Using this method makes loading more history events really simple. You need to get access to the `history` object
for certain chat by calling this method. The returned `history` object has only one method, `next`, which gives you promise
of `{ done, value }` pair.

- `done` - indicates if there is anything more to load
- `value` - it's an array of loaded events

You can keep calling `history.next()` multiple times to load more and more history events (useful for an infinite scroll feature).
Keep in mind, though, that you can only call `next` if the previously returned promise got resolved.

Such structure as our `history` object is called an async iterator.

```js
let wholeChatHistoryLoaded = false

const history = customerSDK.getChatHistory('OU0V0P0OWT')

history.next().then(result => {
    if (result.done) {
        wholeChatHistoryLoaded = true
    }

    const events = result.value
    console.log(events)
})
```

Arguments:

| arguments | type   | description                                             |
| --------- | ------ | ------------------------------------------------------- |
| chat      | string | Chat's id for which history object should be returned   |

<!--### getChatsSummary

```js
customerSDK.getChatsSummary({
    page: 1,
    limit: 10,
})
    .then(chatsSummary => {
        console.log(chatsSummary)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments  | shape   | type   | default | max | description |
| ---------- | ------- | ------ | ------- | --- | ----------- |
| pagination |         |        |         |     |             |
|            | page    | number | 1       |     |             |
|            | limit   | number | 10      | 25  |             |

Returned value:

| array of shapes | type             | description |
| --------------- | ---------------- | ----------- |
| id              |                  | Chat's id   |
| users           | string[]         | Users' ids  |
| lastEvent       | object           | Event       |
-->
## getChatThreads

In most cases you do not need to use this method directly. If you want to load more events consider using [`getChatHistory`](#getchathistory).

```js
const threads = ["OS0C0W0Z1B", "OS0I0M0J0G", "OT01080705", "OT0E02082U", "OT0E08040G"]
customerSDK.getChatThreads("ON0X0R0L67", threads)
    .then(threads => {
        console.log(threads)
    })
    .catch(error => {
        console.log(rror
    })
```

Arguments:

| arguments  | shape   | type     |
| ---------- | ------- | -------- |
| chat       |         | string   |
| threads    | page    | string[] |


Returned value:

| array of shapes     | type             | description                     |
| ------------------- | ---------------- | ------------------------------- |
| id                  | string           | Thread's id                     |
| active              | string[]         | Active state                    |
| order               | number           | order (can be used for sorting) |
| users               | string[]         | Users' ids                      |
| events              | object[]         | Events                          |

## getChatThreadsSummary

In most cases you do not need to use this method directly. If you want to load more events consider using [`getChatHistory`](#getchathistory).

```js
customerSDK.getChatThreadsSummary("ON0X0R0L67", {
    page: 1,
    limit: 10,
})
    .then(summary => {
        console.log(summary.threadsSummary)
        console.log(summary.totalThreads)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments  | shape   | type   | default | max  | description |
| ---------- | ------- | ------ | ------- | ---- | ----------- |
| chat       |         | string |         |      |             |
| pagination |         |        |         |      |             |
|            | offset  | number | 0       |      |             |
|            | limit   | number | 25      | 1000 |             |

Returned value:

| shape               | type             | shape        | type    |
| ------------------- | ---------------- | ------------ | ------- |
| threadsSummary      | object[]         |              |         |
|                     |                  | id           | string  |
|                     |                  | order        | number  |
|                     |                  | totalEvents  | number  |
| totalThreads        | number           |              |         |

## off

Used to unsubscribe from emitted events which are described [here](#events).

## on

Used to subscribe to emitted events which are described [here](#events).

## sendEvent
```js
const event = {
    type: "message",
    // ... other properties specific for the event's type
}

customerSDK.sendEvent("ON0X0R0L67", event)
    .then(event => {
        console.log(event)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments | shape  | type   | description           |
| --------- | ------ | ------ | --------------------- |
| chat      |        | string | Destination chat's id |
| event     |        |        |                       |
|           | type   | string | Type of the event     |
|           | ...    |        | Other properties      |

## sendMessage
```js
const message = { text: "Hello" }

customerSDK.sendMessage("ON0X0R0L67", message)
    .then(message => {
        console.log(message)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments | shape  | type   | description           |
| --------- | ------ | ------ | --------------------- |
| chat      |        | string | Destination chat's id |
| message   |        |        |                       |
|           | text   | string | Customer's message    |

## sendRating - not implemented yet
```js
customerSDK.sendRating("ON0X0R0L67", {
    value: "good",
    comment: "Agent helped me a lot!"
})
    .then(rating => {
        console.log(rating)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments | shape   | type           | description           |
| --------- | ------- | -------------- | --------------------- |
| chat      |         |                | Destination chat's id |
| rating    |         |                |                       |
|           | value   | 'good' / 'bad' | Rating value          |
|           | comment | string         | Optional comment      |

## setSneakPeek

This method doesn't return a promise. It just sets the internal sneak peek value.
It will be sent to the server only if the target chat is active and only once per 2 seconds (it's [throttled](https://lodash.com/docs/4.17.4#throttle)).

```js
customerSDK.setSneakPeek("ON0X0R0L67", "what is the price for your ")
```

Arguments:

| arguments | type   | description                              |
| --------- | ------ | ---------------------------------------- |
| chat      | string | Destination chat id                      |
| text      | string | Message preview broadcasted to the agent |

## startChat
```js
customerSDK.startChat({
    events: [],
})
    .then(chat => {
        console.log(chat)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments     | shape      | type     | description        |
| ------------- | ---------- | -------- | ------------------ |
| specification |            |          | For advanced usage |
|               | scope      |          |                    |
|               | events     | events[] |                    |

<!--### updateChatProperties
```js
const properties = {
    property_namespace: {
        sample: 'property',
    },
}
customerSDK.updateChatProperties("ON0X0R0L67", properties)
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
```

Arguments:

| arguments     | shape      | type     | description        |
| ------------- | ---------- | -------- | ------------------ |
| chat          |            | string   |                    |
| properties    |            |          |                    |

### updateChatThreadProperties
```js
const properties = {
    property_namespace: {
        sample: 'property',
    },
}
customerSDK.updateChatThreadProperties("ON0X0R0L67", "OS0C0W0Z1B", properties)
    .then((response) => {
        console.log(response)
    })
    .catch((error) => {
        console.log(error)
    })
```

Arguments:

| arguments     | shape      | type     | description        |
| ------------- | ---------- | -------- | ------------------ |
| chat          |            | string   |                    |
| thread        |            | string   |                    |
| properties    |            |          |                    |-->

## updateCustomer
```js
const properties = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    custom_property: 'BasketValue=10usd'
}
customerSDK.updateCustomer(properties)
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments     | shape      | type     | description        |
| ------------- | ---------- | -------- | ------------------ |
| properties    |            |          |                    |
|               | name       | string   | Optional name      |
|               | email      | string   | Optional email     |
|               | ...        | string   | Custom properties  |

Returned value:

| shape     | type             |
| --------- | ---------------- |
| success   | boolean          |

## updateLastSeenTimestamp
```js
customerSDK.updateLastSeenTimestamp("ON0X0R0L67", 1500646701447)
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
```

Arguments:

| arguments     | type     | description        |
| ------------- | -------- | ------------------ |
| chat          | string   |                    |
| timestamp     | number   | optional           |

Returned value:

| shape       | type             |
| ----------- | ---------------- |
| timestamp   | number           |

## $$observable

You can consume all emitted events as a stream with [most](https://github.com/mostjs/core) of stream libraries like in example [RxJS](https://github.com/reactivex/rxjs).
We provide an interop point for this, so you can easily convert our SDK to a stream like this:

```js
import Rx from '@reactivex/rxjs'

Rx.Observable.from(visitorSDK)
    .subscribe(([ eventName, eventData ]) => {
        console.log(eventName, eventData)
    })
```
