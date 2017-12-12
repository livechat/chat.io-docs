<div class="hide">

# Customer Chat API

* [Introduction](#introduction)
  * [Web API](#web-api)
  * [Real-Time Messaging API](#real-time-messaging-api)
  * [Authentication](#authentication)
  * [Events order](#events-order)
* [Examples](#examples)
  * [JavaScript](#javascript)
  * [Go](#go)
  * [Python](#python)
* [Objects](#objects)
  * [Chat](#chat)
  * [Thread](#thread)
  * [User](#user)
  * [Event](#event)
  * [Typing indicator](#typing-indicator)
  * [Sneak peek](#sneak-peek)
  * [Scopes](#scopes)
  * [Properties](#properties)
* [Errors handling](#errors-handling)
  * [Format](#format)
  * [Possible errors](#possible-errors)
* [Methods](#methods)
  * [Login](#login)
  * [Get chats summary](#get-chats-summary)
  * [Get chat threads](#get-chat-threads)
  * [Get chat threads summary](#get-chat-threads-summary)
  * [Start chat](#start-chat)
  * [Send event](#send-event)
  * [Send file](#send-file)
  * [Send sneak peek](#send-sneak-peek)
  * [Close thread](#close-thread)
  * [Update chat scopes](#update-chat-scopes)
  * [Update customer](#update-customer)
  * [Update chat properties](#update-chat-properties)
  * [Update chat thread properties](#update-chat-thread-properties)
  * [Update last seen timestamp](#update-last-seen-timestamp)
* [Pushes](#pushes)
  * [Incoming chat thread](#incoming-chat-thread)
  * [Chat users updated](#chat-users-updated)
  * [Incoming event](#incoming-event)
  * [Incoming multicast](#incoming-multicast)
  * [Incoming typing indicator](#incoming-typing-indicator)
  * [Customer disconnected](#customer-disconnected)
  * [Thread closed](#thread-closed)
  * [Chat scopes updated](#chat-scopes-updated)
  * [Customer updated](#customer-updated)
  * [Chat properties updated](#chat-properties-updated)
  * [Chat thread properties updated](#chat-thread-properties-updated)
  * [Last seen timestamp updated](#last-seen-timestamp-updated)
</div>

# Introduction

This documentation describes version **v0.4** of customer-api.

## Web API

Web API is like REST API. Client can send **request message** that results in getting **response message**.

### Requests

API endpoint:

| HTTP method | Endpoint |
|--------|----------------|
| `POST` | `https://api.chat.io/customer/v0.4/action/<action>` |

Required headers:

| Header | Value | Notes |
| --- | --- | --- |
| `Content-Type` | `multipart/form-data; boundary=<boundary>` | Valid for `send_file` action |
| | `application/json` | Valid for every action except `send_file` |
| `Authorization` | `Bearer <token>` | Access token |

Client should send query string params in every request to Web API:

| Param | Required | Type | Notes |
| --- | --- | --- | --- |
| `license_id` | Yes | Integer | LiveChat account ID |

### Messages format

Request
```js
{
	"payload": {
		// optional
	},
}
```

## Real-Time Messaging API

Real-Time Messaging API (RTM API) is based on connection like websocket. Client can send **request message** that results in getting **response message**. It can also get **push messages** anytime.

### Connection

API endpoints:

| Transport | Endpoint |
|--------|----------------|
| `socket.io` | `https://api.chat.io/customer/v0.4/rtm/sio` |
| `websocket` | `wss://api.chat.io/customer/v0.4/rtm/ws` |

Client must send query string param when connecting to RTM API:

| Param | Required | Type | Notes |
| --- | --- | --- | --- |
| `license_id` | Yes | Integer | LiveChat account ID |

Example:

```
https://api.chat.io/customer/v0.4/rtm/ws?license_id=123456789
```

Ping:

Client should implement server pinging or connection will be closed after about one minute of inactivity. If [control frame ping](https://tools.ietf.org/html/rfc6455#section-5.5.2) is unavailable (web browsers), client should use protocol message with action `ping`.

### Messages format

Request
```js
{
	"request_id": "<request_id>", // optional
	"action": "<action>",
	"payload": {
		// optional
	}
}
```

Response
```js
{
	"request_id": "<request_id>", // optional
	"action": "<action>",
	"type": "response",
	"success": true,
	"payload": {
		// optional
	}
}
```

Push
```js
{
	"request_id": "<request_id>", // optional, applies only to requester
	"action": "<action>",
	"type": "push",
	"payload": {
		// optional
	}
}
```

## Authentication
Customer authentication is done with access token. See how to obtain the customer access token in [Authorization](../../authorization) article.

## Events order
Chat messages are not guaranteed to be sorted by server. Client should sort them by `order` parameter. Do not use `timestamp` to sort messages because two events can have the same timestamp.

# Examples
All examples are similar i.e., connects and logins to Agent API and starts chat with sending welcome message via Websocket.

## JavaScript
Example file: [examples/example.js](./examples/example.js)

## Go
Example file: [examples/example.go](./examples/example.go)

Remember to install proper lib:
```
go get github.com/gorilla/websocket
```

## Python
Example file: [examples/example.py](./examples/example.py)

Remember to install proper lib:
```
sudo pip install websocket-client
```

# Objects
Objects are standardized data formats that are used in API requests and responses.

You don't need to wonder if you should use `chat_id` or `chatID` parameter in your API call. Instead, just look up the `Chat` object structure to know how to use it in the request or when parsing the response.

Objects can include other objects. For example, `Chat` object may return `users` array which is a list of `User` objects.

## Thread
```js
{
	"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"active": true,
	"order": 123123,
	"user_ids": ["john@gmail.com"],
	"events": [
		// array of "Event" objects
	],
	"properties": {
		// "Properties" object
	}
}
```
* `active` possible values:
  * `true` (thread still active)
  * `false` (thread no longer active)

* `properties` is optional


## Chat
```js
{
	"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"users": [
		// array of "User" objects
	],
	"threads": [
		// array of "Thread" objects
	],
	"properties": {
		// "Properties" object
	}
}
```
* `properties` is optional

## User

### Customer

```js
{
	"id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"type": "customer",
	"name": "John Smith",
	"email": "john@gmail.com",
	"present": true,
	"fields": {
		"custom field name": "custom field value"
	},
	"last_seen_timestamp": 1473433500
}
```

### Agent

```js
{
	"id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"type": "agent",
	"name": "Support Team",
	"avatar": "cdn.livechatinc.com/avatars/1.png",
	"present": true,
	"last_seen_timestamp": 1473433500
}
```

## Event

### Message

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12312.301231238591134",
	"order": 1, // generated by server side
	"type": "message",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"text": "hello there",
	"properties": {
		// "Properties" object
	}
}
```
* `custom_id` is optional
* `properties` is optional

### System message

Cannot be sent by user

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"order": 1, // generated by server side
	"type": "system_message",
	"timestamp": 1473433500, // generated by server side
	"text": "hello there",
	"system_message_type": "thread_archived"
}
```

### Annotation

Does not create new thread, just adds event to last thread without extending thread duration.

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12312.301231238591134",
	"order": 1, // generated by server side
	"type": "annotation",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"text": "Example annotation",
	"annotation_type": "rating",
	"properties": {
		// "Properties" object
	}
}
```
* `custom_id` is optional
* `text` is optional
* `properties` is optional

### Filled form
```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12312.301231238591134",
	"order": 4, // generated by server side
	"type": "filled_form",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"properties": {
		// "Properties" object
	},
	"fields": [{
			"type": "text",
			"name": "name",
			"label": "Your name",
			"required": true,
			"value": "Jan Kowalski"
		},
		{
			"type": "email",
			"name": "email",
			"label": "Your email",
			"required": true,
			"value": "jan.kowalski@gmail.com"
		},
		{
			"type": "radio",
			"name": "purpose",
			"label": "Chat purpose",
			"required": true,
			"options": [{
					"label": "Support",
					"value": "support",
					"checked": true
				},
				{
					"label": "Sale",
					"value": "sale",
					"checked": false
				}
			]
		},
		{
			"type": "checkbox",
			"name": "industry",
			"label": "Company industry",
			"required": true,
			"options": [{
				"label": "automotive",
				"value": "automotive",
				"checked": true
			}, {
				"label": "IT",
				"value": "it",
				"checked": true
			}]
		},
		{
			"type": "select",
			"name": "country",
			"label": "Country",
			"required": true,
			"options": [{
				"label": "USA",
				"value": "usa",
				"checked": false
			}, {
				"label": "Poland",
				"value": "pl",
				"checked": true
			}]
		}
	]
}
```
* `custom_id` is optional
* `properties` is optional

### File
```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12312.301231238591134",
	"order": 1, // generated by server side
	"type": "file",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"properties": {
		// "Properties" object
	},
	"name": "image25.png",
	"url": "https://domain.com/asdsfdsf.png",
	"content_type": "image/png",
	"size": 123444,
	"width": 640,
	"height": 480
}
```
* `custom_id` is optional
* `properties` is optional

### Custom

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12312.301231238591134",
	"order": 1, // generated by server side
	"type": "custom",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"content": {
		"custom": {
			"nested": "json"
		}
	},
	"properties": {
		// "Properties" object
	}
}
```

* `custom_id` is optional
* `properties` is optional

## Typing indicator
```js
{
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500,
	"is_typing": true
}
```

## Sneak peek
```js
{
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500,
	"text": "hello there"
}
```

## Scopes
Empty object designates no scope, it means that all agents can see it.

```js
{
	"scopes": {
		"groups": [1, 2]
	}
}
```

## Properties
```js
{
	"<property_namespace>": {
		"<property_name>": {
			"value": < property_value > // <property_value> type depends on the property configuration
		}
	}
}
```

Example properties:
```js
{
	"properties": {
		"rating": {
			"score": {
				"value": 1
			},
			"comment": {
				"value": "rated good!"
			}
		},
		"routing": {
			"idle": {
				"value": false
			}
		}
	}
}
```

# Errors handling
## Format
Error payload has format:

```
{
	"error": {
		"type": "incorrect_region",
		"message": "License is in another region",
		"data": { // optional
			"region": "dal"
		}
	}
}
```

`data` is optional, most errors don't use it

## Possible errors

| Type | Default Message | Notes |
|--------|----------------|---|
| `internal` | Internal server error | |
| `customer_banned` | Customer is banned | |
| `validation` | Wrong format of request | |
| `authorization` | Authorization error | Customer is not allowed to perform action |
| `authentication` | Authentication error | Invalid / expired access token |
| `license_expired` | License expired | |
| `request_timeout` | Request timeouted | Timeout threshold is 15 seconds |


# Methods

## Login

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `login` | ✓ | - | - |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `token` | Yes | OAuth token from customer accounts |
| `customer.monitoring.page.url` | No | |
| `customer.monitoring.page.title` | No | |
| `customer.monitoring.page.referrer` | No | |
| `customer.monitoring.timezone` | No | |
| `customer.name` | No | |
| `customer.email` | No | |
| `customer.fields` | No | map in `"key": "value"` format |

Example request payload
```js
{
	"token": "Bearer p-cjQcfhTqego5I48WeAPw",
	"customer": {
		"monitoring": {
			"page": {
				"url": "https://www.livechatinc.com/"
			}
		}
	}
}
```

Example response payload
```js
{
	"customer_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"static_config_path": "s3.amazonaws.com/livechat/license/123/config.json"
}
```

## Get chats summary

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_chats_summary` | ✓ | - | - |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `offset` | No | Default is 0, maximum is 100 |
| `limit` | No | Default is 10, maximum is 25 |

Example request payload
```js
{
	"offset": 0,
	"limit": 25
}
```

Example response payload
```js
{
	"chats_summary": [{
		"id": "123",
		"order": 343544565,
		"users": [
			// array of "User" objects
		],
		"properties": {
			// "Properties" object
		},
		"scopes": {
			// "Scopes" object
		},
		"last_event_per_type": { // last event of each type in chat
			"message": {
				"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
				"thread_order": 343544565,
				"event": {
					// "Event > Message" object
				}
			},
			"system_message": {
				"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
				"thread_order": 343544565,
				"event": {
					// "Event > System message" object
				}
			},
			...
		}
	}],
	"total_chats": 20
}
```


## Get chat threads

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_chat_threads` | ✓ | - | - |

Request payload:

| Request object | Required |
|----------------|----------|
| `chat_id` | Yes |
| `thread_ids` | Yes |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_ids": ["a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5"]
}
```

Example response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"properties": {
			// "Properties" object
		},
		"scopes": {
			// "Scopes" object
		},
		"threads": [
			// Thread object
		]
	}
}
```

## Get chat threads summary

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_chat_threads_summary` | ✓ | - | - |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes |
| `offset` | No | Default is 0 |
| `limit` | No | Default is 25, maximum is 100 |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"offset": 0,
	"limit": 100
}
```

Example response payload
```js
{
	"threads_summary": [{
			"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
			"order": 129846129847,
			"total_events": 1
		},
		{
			"id": "b0c22fdd-fb71-40b5-bfc6-a8a0bc3117f6",
			"order": 129846129848,
			"total_events": 0
		}
	],
	"total_threads": 4
}
```


## Start chat

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `start_chat` | ✓ | ✓ | [`incoming_chat_thread`](#incoming-chat-thread) |

Note: customer details must be sent to server before the chat can be started (see [`update customer`](#update-customer) method).

Request payload:

| Request object | Required | Notes |
|----------------|----------|---|
| `chat.scopes` | No | Chat scope to set, defaults to all agents |
| `chat.events` | No | Initial chat events array |
| `chat.properties` | No | Initial chat properties |
| `chat.thread.properties` | No | Initial chat thread properties |

Example request payload
```js
{
	"chat": {
		"scopes": {
			"groups": [1]
		},
		"properties": {
			"source": {
				"type": "facebook"
			}
		},
		"thread": {
			"events": [{
				"type": "message",
				"custom_id": "12312.301231238591134",
				"text": "hello there"
			}, {
				"type": "system_message",
				"custom_id": "12312.301231238591135",
				"text": "hello there"
			}],
			"properties": {
				"source": {
					"type": "facebook"
				},
				...
			}
		}
	}
}
```

Example response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"properties": {
			// "Properties" object
		},
		"scopes": {
			// "Scopes" object
		},
		"thread": {
			// "Thread" object
		}
	}
}
```

## Send event

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `send_event` | ✓ | ✓ | [`incoming_event`](#incoming-event) <br> or <br> [`incoming_chat_thread`](#incoming-chat-thread)* |

\* `incoming_chat_thread` will be sent instead of `incoming_event` only if the event starts a new thread

Request payload:

| Request object | Required | Notes                    |
|----------------|----------|--------------------------|
| `chat_id`      | Yes      | Id of the chat that we want to send the message to |
| `event`        | Yes      | Event object             |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"event": {
		"type": "message",
		"text": "hello world",
		"custom_id": "12345-bhdsa"
	}
}
```

Example response payload
```js
{
	"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"event": {
		// "Event" object
	}
}
```

## Send file

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `send_file` | - | ✓ | [`incoming_event`](#incoming-event) <br> or <br> [`incoming_chat_thread`](#incoming-chat-thread)* |

\* `incoming_chat_thread` will be sent instead of `incoming_event` only if the event starts a new thread

Request (with payload):

| Request object | Required | Notes |
|----------------|----------|-------|
| `payload.chat_id`      | Yes      | Id of the chat that we want to send the file to |
| `payload.custom_id`        | Yes      | |
| `payload.file`      | Yes      | max 10MB |

* Content-Type header in form `Content-Type: multipart/form-data; boundary=<boundary>` is required.

Example request (with payload)
```
	payload.chat_id=a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5
	payload.custom_id=12345-bhdsa
	payload.file=test.png
```

Example response payload
```js
{
	"url": "https://cdn.chatio-static.com/api/file/chatio/att/345678/bhdbfhdbf87348374837483.png"
}
```

## Send sneak peek

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `send_sneak_peek` | ✓ | ✓ | - |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes | Id of the chat that we want to send the sneak peek to |
| `sneak_peek_text` | Yes | Sneak peek text |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"sneak_peek_text": "hello world"
}
```

No response payload.

## Close thread

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `close_thread` | ✓ | ✓ | [`thread_closed`](#thread-closed) |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes ||

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5"
}
```

No response payload.

## Update chat scopes

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_scopes` | ✓ | ✓ | [`chat_scopes_updated`](#chat-scopes-updated) |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes ||
| `add_scopes` | No | Chat scopes to add |
| `remove_scopes` | No | Chat scopes to remove |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"add_scopes": {
		"groups": [1, 2]
	},
	"remove_scopes": {
		"groups": [3]
	}
}
```

No response payload.

## Update customer

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_customer` | ✓ | ✓ | [`customer_updated`](#customer-updated)* |

\* `customer_updated` will be sent as many times as there are active chats

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `customer.name` | No | |
| `customer.email` | No | |
| `customer.monitoring.page.title` | No | |
| `customer.monitoring.page.url` | No | |
| `customer.monitoring.timezone` | No | |
| `customer.fields` | No | Map in `"key": "value"` format|

Example request payload
```js
{
	"customer": {
		"name": "Mary Brown",
		"email": "mary.brown@gmail.com",
		"monitoring": {
			"page": {
				"url": "https://www.livechatinc.com/",
				"title": "LiveChat - Homepage"
			},
			"timezone": "-2"
		},
		"fields": {
			"key1": "val1"
		}
	}
}
```

Example response payload
```js
{
	"customer": {
		// "User > Customer" object
	}
}
```

## Update chat properties

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_properties` | ✓ | ✓ | [`chat_properties_updated`](#chat-properties-updated) |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id`      | Yes      | Id of the chat that we want to set property for |
| `properties`   | Yes      | Chat properties to set |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"properties": {
		"rating": {
			"score": 1,
			"comment": "Very good, veeeery good"
		},
		...
	}
}
```

No response payload.

## Update chat thread properties

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_thread_properties` | ✓ | ✓ | [`chat_thread_properties_updated`](#chat-thread-properties-updated) |

Request payload:

| Request object | Required | Notes                                              |
|----------------|----------|----------------------------------------------------|
| `chat_id`      | Yes      | Id of the chat that we want to set property for    |
| `thread_id`    | Yes      | Id of the thread that we want to set property for  |
| `properties  ` | Yes      | Chat properties to set                             |

Example request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_id": "EW2WQSA8",
	"properties": {
		"rating": {
			"score": 1,
			"comment": "Very good, veeeery good"
		},
		...
	}
}
```

No response payload.

## Update last seen timestamp

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_last_seen_timestamp` | ✓ | - | [`last_seen_timestamp_updated`](#last-seen-timestamp-updated) |

Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `timestamp` | No | |


Example request payload
```js
{
	"timestamp": 123456789
}
```

Example response payload
```js
{
	"timestamp": 123456789
}
```


# Pushes
Server => Client methods are used for keeping application state up-to-date. They are available only in `websocket` transport.

## Incoming chat thread

| Action | Payload |
|--------|------------------|
| `incoming_chat_thread` |
|  | `chat` |

Example response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"properties": {
			// "Properties" object
		},
		"scopes": {
			// "Scopes" object
		},
		"thread": {
			// "Thread" object
		}
	}
}
```

## Chat users updated

| Action | Payload |
|--------|------------------|
| `chat_users_updated` |
|  | `chat_id` |
|  | `updated_users` |

Example response payload
```js
{
	"chat_id": "88888898-f88f-4321-1234-123123",
	"updated_users": {
		"added": [
			// User
		],
		"removed_ids": ["123", "1234"]
	}
}
```

## Incoming event

| Action             | Payload     |
|--------------------|-------------|
| `incoming_event`   |             |
|                    | `chat_id`   |
|                    | `thread_id` |
|                    | `event`     |

Example response payload
```js
{
	"chat_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0a",
	"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"event": {
		// "Event" object
	}
}
```

## Incoming multicast

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_multicast` | ✓ | - |

Event payload:

| Object         | Notes    |
|----------------|----------|
| `author_id`       |          |
| `content`       |          |


Example response payload
```js
{
	"author_id": "jack@gmail.com",
	"content": {
		"example": {
			"nested": "json"
		}
	}
}
```

## Incoming typing indicator

| Action | Payload |
|--------|------------------|
| `incoming_typing_indicator` |
|  | `chat_id` |
|  | `typing_indicator` |

Example request payload
```js
{
	"chat_id": "123-123-123-123",
	"typing_indicator": {
		// "Typing indicator" object
	}
}
```

## Customer disconnected

| Action | Payload |
|--------|------------------|
| `customer_disconnected` |
|  | `reason` |

Example response payload
```js
{
	"reason": "customer_banned"
}
```

### Possible reasons
| Type | Notes |
|--------|----------------|
| `customer_banned` | Customer has been banned |
| `too_many_connections` | Customer reached max number of connections |
| `license_not_found` | License with specified ID doesn't exist |
| `internal_error` | Internal error |

## Thread closed

| Action | Payload | Notes |
|--------|------------------|----|
| `thread_closed` | |
|  | `chat_id` | |
|  | `thread_id` | |
|  | `user_id` | Missing if thread was closed by router |

Example response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"user_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d" // optional
}
```

## Chat scopes updated

| Action | Payload |
|--------|------------------|
| `chat_scopes_updated` |
|  | `chat_id` |
|  | `scopes_added` |
|  | `scopes_removed` |

Example response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"scopes_added": {
		// "Scopes" object
	},
	"scopes_removed": {
		// "Scopes" object
	}
}
```

## Customer updated

| Action | Payload |
|--------|------------------|
| `customer_updated` |
|  | `chat_id` |
|  | `customer` |

Example response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"customer": {
		// "User > Customer" object
	}
}
```

## Chat properties updated

| Action | Payload |
|--------|------------------|
| `chat_properties_updated` |
|  | `chat_id` |
|  | `properties` |

Example payload
```js
{
	"chat_id": "123-123-123-123",
	"properties": {
		"rating": {
			"comment": {
				"value": "gooood"
			}
		}
	}
}
```


## Chat thread properties updated

| Action | Payload |
|--------|------------------|
| `chat_thread_properties_updated` |
|  | `chat_id` |
|  | `thread_id` |
|  | `properties` |

Example payload
```js
{
	"chat_id": "123-123-123-123",
	"thread_id": "E2WDHA8A",
	"properties": {
		"rating": {
			"comment": {
				"value": "goooood"
			}
		}
	}
}
```

## Last seen timestamp updated

| Action | Payload |
|--------|------------------|
| `last_seen_timestamp_updated` |
|  | `user_id` |
|  | `chat_id` |
|  | `timestamp` |

Example response payload
```js
{
	"user_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"chat_id": "123-123-123-123",
	"timestamp": 123456789
}
```
