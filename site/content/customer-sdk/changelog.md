---
title: "Changelog"
weight: 60
---

# Changelog

#### [v0.8.0] - 2018-01-05

##### Added

* chatsSummary objects (returned from `getChatsSummary` method and available in
  payloads of `connected`/`connection_restored` events) got a new property -
  `lastEventsPerType`, which is an object that maps event types to event objects
* `updateChatProperties` method and corresponding `chat_properties_updated`
  event
* `updateChatThreadProperties` method and corresponding
  `chat_thread_properties_updated` event

##### Fixed

* using multiple instances in React Native
* using in React Native on Android

#### [v0.7.0] - 2017-11-24

##### Changed

* `sendFile` returns `{ url }` now instead of `{ success: true }`
* events no longer have `order` property
* users no longer have `present` property

##### Fixed

* it's possible now to create 2 independent instances of the SDK
* `file` events with `url` property

#### [v0.6.0] - 2017-11-23

##### Changed

* `customId` is added only if it has been explicitly passed in as part of an event
* `customId` is not reused as request's id anymore
* made it impossible to send 2 requests with identical ids until a response
  comes in

#### [v0.5.0] - 2017-11-22

##### Added

* `sendFile` method

##### Changed

* UMD export was renamed `CustomerSDK`

#### [v0.4.2] - 2017-11-18

##### Fixed

* server errors handling - promises should get rejected correctly now

#### [v0.4.1] - 2017-11-18

##### Fixed

* UMD builds from `dist` directory

#### [v0.4.0] - 2017-11-18

##### Added

* `chatSummary` object (from `getChatsSummary`'s response and from `connected`
  and `connection_restored` events) got new property: `lastSeenTimestamps` which
  is a map from user IDs to optional timestamps

##### Changed

* `init` now accepts configuration object (`{ license, clientId }`) instead of
  just a license number (in React Native the configuration object expects
  additionally `redirectUri`)
* `getChatThreads` now returns an array of `threads` instead of `{ threads,
  users }` object
* removed `lastSeenTimestamp` from user objects
* `AuthWebView` exposed from `@livechat/chat.io-customer-auth` for React Native
  integration no longer needs a license prop

#### [v0.3.1] - 2017-11-16

##### Fixed

* parsing server events

#### [v0.3.0] - 2017-11-16

##### Added

* support for React Native apps, you can read more in "How to start" section
* `getChatsSummary` method
* `destroy` method
* `user_joined_chat` and `user_left_chat` events
* threads and thread summaries got a new property - `chat`

##### Changed

* `updateCustomer` now accepts the explicit `fields` property in its argument
* `thread_metadata` event was renamed `thread_summary`
