<div class="hide">

# Agent Chat API

* [Introduction](#introduction)
  * [Web API](#web-api)
  * [Real-Time Messaging API](#real-time-messaging-api)
  * [Authentication](#authentication)
  * [Events order](#events-order)
* [Examples](#examples)
  * [JavaScript](#javascript)
  * [Go](#go)
  * [Python](#python)
* [SSO scopes for resources](#sso-scopes-for-resources)
* [Objects](#objects)
  * [Thread](#thread)
  * [User](#user)
  * [Event](#event)
  * [Typing indicator](#typing-indicator)
  * [Sneak peek](#sneak-peek)
  * [Ban](#ban)
  * [Scopes](#scopes)
  * [Properties](#properties)
* [Methods](#methods)
  * [Login](#login)
  * [Get archives](#get-archives)
  * [Get filtered chats](#get-filtered-chats)
  * [Get chat threads](#get-chat-threads)
  * [Start chat](#start-chat)
  * [Join chat](#join-chat)
  * [Remove from chat](#remove-from-chat)
  * [Send event](#send-event)
  * [Multicast](#multicast)
  * [Send typing indicator](#send-typing-indicator)
  * [Ban customer](#ban-customer)
  * [Close thread](#close-thread)
  * [Update chat scopes](#update-chat-scopes)
  * [Update agent](#update-agent)
  * [Change push notifications](#change-push-notifications)
  * [Update chat properties](#update-chat-properties)
  * [Update chat thread properties](#update-chat-thread-properties)
  * [Update last seen timestamp](#update-last-seen-timestamp)
  * [Add auto chat scopes](#add-auto-chat-scopes)
  * [Remove auto chat scopes](#remove-auto-chat-scopes)
  * [Get auto chat scopes config](#get-auto-chat-scopes-config)
  * [Upload image](#upload-image)
* [Pushes](#pushes)
  * [Incoming chat thread](#incoming-chat-thread)
  * [Chat users updated](#chat-users-updated)
  * [Incoming event](#incoming-event)
  * [Incoming multicast](#incoming-multicast)  
  * [Incoming typing indicator](#incoming-typing-indicator)
  * [Incoming sneak peek](#incoming-sneak-peek)
  * [Customer banned](#customer-banned)
  * [Thread closed](#thread-closed)
  * [Chat scopes updated](#chat-scopes-updated)
  * [Customer updated](#customer-updated)
  * [Agent updated](#agent-updated)
  * [Agent disconnected](#agent-disconnected)
  * [Chat properties updated](#chat-properties-updated)
  * [Chat thread properties updated](#chat-thread-properties-updated)
  * [Last seen timestamp updated](#last-seen-timestamp-updated)
</div>

# Introduction

This documentation describes version **v0.4** of agent-api.

<div class="callout type-info">Throughout the text we will use the term <strong>"client"</strong> to describe a service (an application, a script, an integration, etc.) which uses chat.io Agent API.</div>

## Web API

Web API is similar to REST API. A client can send a **request message** that results in getting a **response message**.

### Requests

#### API endpoint

| HTTP method | Endpoint |
|--------|----------------|
| `POST` | `https://api.chat.io/agent/v0.4/action/<action>` |

#### Required headers

| Header | Value | Notes |
| --- | --- | --- |
| `Content-Type` | `multipart/form-data; boundary=<boundary>` | Valid for `send_file` action |
| | `application/json` | Valid for every action except `upload_image` |
| `Authorization` | `Bearer <token>` | Access token |

### Messages format

#### Request
```js
{
	"payload": {
		// optional
	},
	"author_id": "<author_id>" // optional, applies only to bots
}
```

## Real-Time Messaging API

Real-Time Messaging API (RTM API) is based on a websocket-like connection. A client can send **request message** that results in getting **response message**. It can also get **push messages** anytime.

### Connection

#### API endpoints

| Transport | Endpoint |
|--------|----------------|
| `socket.io` | `https://api.chat.io/agent/v0.4/rtm/sio` |
| `websocket` | `wss://api.chat.io/agent/v0.4/rtm/ws` |

##### Example

```
https://api.chat.io/agent/v0.4/rtm/ws
```

#### Ping

A client should ping the server each 15 seconds, otherwise the connection will be closed after about one minute of inactivity. If [control frame ping](https://tools.ietf.org/html/rfc6455#section-5.5.2) is unavailable (in web browsers), a client should use a protocol message with `ping` action.

### Messages format

#### Request
```js
{
	"request_id": "<request_id>", // optional
	"action": "<action>",
	"payload": {
		// optional
	},
	"author_id": "<author_id>" // optional, applies only to bots
}
```

#### Response
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

#### Push
```js
{
	"request_id": "<request_id>", // optional, applies only to the requester
	"action": "<action>",
	"type": "push",
	"payload": {
		// optional payload
	}
}
```

## Authentication
Agent authentication is handled by access tokens. See how to obtain an access token in [Authorization](../../authorization) section.

## Events order
Chat messages are not guaranteed to be sorted by server. A client should sort them by `order` parameter. Do not use `timestamp` to sort messages because two events can have the same timestamp.

# Examples
All examples have a similar structure: they connect and log in to Agent API and then start a chat by sending a welcome message (via Websocket).

## JavaScript
Sample file: [examples/example.js](./examples/example.js)

## Go
Sample file: [examples/example.go](./examples/example.go)

Remember to install the proper lib:
```
go get github.com/gorilla/websocket
```

## Python
Sample file: [examples/example.py](./examples/example.py)

Remember to install the proper lib:
```
sudo pip install websocket-client
```

# SSO scopes for resources
| Scope | API methods | permission | Description |
|-------|-------------|------------|-------------|
| `chats--all:read` | `get_archives`, `get_filtered_chats`, `get_chat_threads`, `update_last_seen_timestamp` | administrator | Read access for all license chats |
| `chats--chat_scopes:read` | `get_archives`, `get_filtered_chats`, `get_chat_threads` | normal | Read access for the chats with chat scopes matching me |
| `chats--my:read` | `get_archives`, `get_filtered_chats`, `get_chat_threads` | normal | Read access for the chats I belong to |
| `chats.conversation--chat_scopes:write` | `join_chat`(joining by myself), `remove_from_chat`(leaving by myself), `send_event`, `send_typing_indicator`, `update_chat_properties`, `update_chat_thread_properties` | normal | Write access for conversation data of chats with chat scopes matching me |
| `chats.conversation--my:write` | `remove_from_chat`(leaving by myself), `send_event`, `send_typing_indicator`, `update_chat_properties`, `update_chat_thread_properties` | normal | Write access for conversation data of chats I belong to |
| `chats.meta--chat_scopes:write` | `join_chat`, `remove_from_chat`, `close_thread`, `update_chat_scopes`, `start_chat` | normal | Write access for meta data of chats with chat scopes matching me |
| `chats.meta--my:write` | `join_chat`, `remove_from_chat`, `close_thread`, `update_chat_scopes` | normal | Write access for meta data of chats I belong to |
| --- | --- | --- |
| `customers.ban:write` | `ban_customer` | normal | Access for banning customers |
| `customers.identity--manage` | - | administrator | Access for use a customer identity | 
| --- | --- | --- |
| `broadcast:write` | `multicast` | normal | Access for multicast data to agents or customers |
| `agents--my:write` | `update_agent` | normal | Write access for my agent data |
| `agents--all:write` | `update_agent` | administrator | Write access for all agents data |
| --- | --- | --- |
| `configurations.auto_chat_scopes:read` | `get_auto_chat_scopes_config` | administrator | Read access for auto chat scopes configuration |
| `configurations.auto_chat_scopes:write` | `add_auto_chat_scopes`, `remove_auto_chat_scopes` | administrator | Write access for auto chat scopes configuration |
| --- | --- | --- |
| `configurations.properties--my:read` | - | administrator | Read access for chat/thread/events/... properties validator configuration (my namespace) |
| `configurations.properties--my:write` | - | administrator | Write access for chat/thread/events/... properties validator configuration (my namespace) |
| `configurations.properties--all:read` | - | administrator | Read access for chat/thread/events/... properties validator configuration (all license) |
| `configurations.properties--all:write` | - | administrator | Write access for chat/thread/events/... properties validator configuration (all license) |
| --- | --- | --- |
| `configurations.webhooks--my:read` | - | administrator | Read access for webhooks configuration (my webhooks) |
| `configurations.webhooks--my:write` | - | administrator | Write access for webhooks configuration |
| `configurations.webhooks--all:read` | - | administrator | Read access for webhooks configuration (all license) |
| `configurations.webhooks--all:write` | - | administrator | write access for webhooks configuration (all license, for deletion only) |



# Objects
Objects are standardized data formats that are used in API requests and responses.

## Thread
```js
{
	"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"timestamp": 1473433500,
	"active": true,
	"user_ids": ["john@gmail.com"],
	"events": [
		// array of "Event" objects
	],
	"order": 112057129857,
	"properties": {
		// "Properties" object
	}
}
```
* `active` can take the following values:
  * `true` (thread is still active)
  * `false` (thread no longer active)
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
	"last_seen_timestamp": 1473433500,
	"monitoring": {
		"current_visit": {
			"start": 1474659379,
			"pages": [{
					"start": 1474659379,
					"url": "https://www.livechatinc.com/",
					"title": "LiveChat - Homepage"
				},
				{
					"start": 1474659393,
					"url": "https://www.livechatinc.com/tour",
					"title": "LiveChat - Tour"
				}
			]
		},
		"stats": {
			"visits": 16,
			"threads": 7,
			"page_views": 29,
			"last_visit": 1474636646
		},
		"referrer": "http://www.google.com/",
		"ip": "194.181.146.130",
		"host": "87-99-47-205.internetia.net.pl",
		"user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
		"geolocation": {
			"country": "Poland",
			"country_code": "PL",
			"region": "Dolnoslaskie",
			"city": "Wroclaw",
			"timezone": "Europe/Warsaw"
		}
	},
	"fields": {
		"custom field name": "custom field value"
	},
	"banned": false
}
```

Optional properties:

* `name`
* `email`
* `last_seen_timestamp`
* `monitoring`
* `properties`

### Agent
```js
{
	"id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"type": "agent",
	"name": "Support Team",
	"email": "john@gmail.com",
	"present": true,
	"last_seen_timestamp": 1473433500,
	"avatar": "cdn.livechatinc.com/avatars/1.png",
	"routing_status": "accepting_chats"
}
```
`routing_status` will be returned only if the agent is currently logged in.

### My profile
```js
{
	"id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"type": "agent",
	"name": "Support Team",
	"email": "john@gmail.com",
	"present": true,
	"last_seen_timestamp": 1473433500,
	"avatar": "cdn.livechatinc.com/avatars/1.png",
	"routing_status": "accepting_chats",
	"permission": "administrator"
}
```

## Event

### Message
```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated by server side
	"custom_id": "12345-bhdsa",
	"order": 1, // generated by server side
	"type": "message",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated by server side
	"text": "hello there",
	"recipients": "all",
	"properties": {
		// "Properties" object
	}
}
```
* `recipients` can take the following values: `all` (default), `agents`
* `custom_id` is optional
* `properties` is optional

### System message

It cannot be sent by a user.

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated server-side
	"custom_id": "12345-bhdsa",
	"order": 1, // generated server-side
	"type": "system_message",
	"timestamp": 1473433500, // generated server-side
	"text": "hello there",
	"recipients": "all"
}
```
* `recipients` can take the following: values: `all` (default), `agents`
* `custom_id` is optional

### Annotation

An annotation does not create a new thread. It just adds an event to the last thread without extending thread duration.

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated server-side
	"custom_id": "12345-bhdsa",
	"order": 1, // generated server-side
	"type": "annotation",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated server-side
	"text": "Sample annotation",
	"recipients": "all",
	"annotation_type": "rating",
	"properties": {
		// "Properties" object
	}
}
```
* `recipients` can take the following values: `all` (default), `agents`
* `custom_id` is optional
* `properties` is optional

### Filled form
```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated server-side
	"custom_id": "12345-bhdsa",
	"order": 4, // generated server-side
	"type": "filled_form",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated server-side
	"recipients": "all",
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

* `recipients` can take the following values: `all` (default), `agents`
* `custom_id` is optional
* `properties` is optional

### File
```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated server-side
	"custom_id": "12345-bhdsa",
	"order": 1, // generated server-side
	"type": "file",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated server-side
	"recipients": "all",
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

* `recipients` can take the following values: `all` (default), `agents`
* `properties` is optional
* `custom_id` is optional

### Custom

```js
{
	"id": "0affb00a-82d6-4e07-ae61-56ba5c36f743", // generated server-side
	"custom_id": "12345-bhdsa",
	"order": 1, // generated server-side
	"type": "custom",
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"timestamp": 1473433500, // generated server-side
	"content": {
		"custom": {
			"nested": "json"
		}
	},
	"recipients": "all",
	"properties": {
		// "Properties" object
	}
}
```

* `recipients` can take the following values: `all` (default), `agents`,
* `custom_id` is optional
* `properties` is optional

## Typing indicator
```js
{
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"recipients": "all",
	"timestamp": 1473433500
}
```

## Sneak peek
```js
{
	"author_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"recipients": "agents",
	"timestamp": 1473433500,
	"text": "hello there"
}
```

## Ban
```js
{
	"days": 5
}
```
* `days` - the number of days the ban will last

## Scopes
An empty object designates no scope, which means that all agents can see it.

 ```js
 {
	"scopes": {
		"groups": [1, 2],
		"agents": ["john@doe.com"]
	}
}
 ```

## Properties

General format:
```js
{
	"<property_namespace>": {
		"<property_name>": {
			"value": <property_value> // <property_value> type depends on the property configuration
		}
	}
}
```

Sample properties:
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

# Methods

## Login
It returns current agent's initial state.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `login` | ✓ | - | - |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `token`| Yes | SSO Token |
| `reconnect` | No | Reconnecting sets status to last known state instead of default |
| `push_notifications.firebase_token` | No | Firebase device token to allow connecting this instance with existing push notification instance (to be seen as 1 instance) |
| `push_notifications.platform` | Yes | OS platform |
| `application.name` | No | Application name |
| `application.version` | No | Application version |

* `<platform>` can take the following values:
  * `ios` - iOS operating system
  * `android` - Android operating system

#### Sample request payload
```js
{
	"push_notifications": {
		"firebase_token": "JDa8813Ka92mmKda00dsdkAKDA0",
		"platform": "ios"
	},
	"application": {
		"name": "SmartClient - Chrome",
		"version": "4.1.2.1231 (57.0.2987.133)"
	}
}
```

#### Sample response payloads
```js
{
	"license": {
		"id": "123",
		"plan": "enterprise",
		"expiration_timestamp": 1483433500,
		"creation_timestamp": 1482433500
	},
	"my_profile": {
		// "User > My profile" object
	},
	"chats_summary": [{
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"last_event_per_type": { // the last event of each type in chat
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
		},
		"last_thread_summary": {
			"id": "OE070R0W0U",
			"timestamp": 1473433500,
			"user_ids": ["john@gmail.com"],
			"order": 12417249812721,
			"properties": {
				"routing": {
					"idle": {
						"value": false
					},
					"unassigned": {
						"value": false
					}
				},
				...
			}
		},
		"properties": {
			"routing": {
				"idle": {
					"value": false
				},
				"unassigned": {
					"value": false
				}
			},
			...
		},
		"scopes": {
			// "Scopes" object
		}
	}]
}
```
* `properties` is optional
* `scopes` is optional


## Get archives
It returns active threads that the current agent has access to.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_archives` | ✓ | - | - |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `filters.query` | No | |
| `filters.date_from` | No | `YYYY-MM-DD` format |
| `filters.date_to` | No | `YYYY-MM-DD` format |
| `filters.agent_ids` | No | Array of agent IDs |
| `filters.team_ids` | No | Array of team IDs |
| `filters.properties.<namespace>.<name>.<filter_type>` | No | |
| `pagination.page` | No | |
| `pagination.limit` | No | |

* `<filter_type>` can take the following values (only one is allowed for single property):
  * `exists` (`bool`)
  * `values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)
  * `exclude_values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)

#### Sample request payload
```js
{
	"filters": {
		"query": "search keyword",
		"agents": ["p.bednarek@livechatinc.com"],
		"date_from": "2016-09-01",
		"date_to": "2016-10-01",
		"properties": {
			"rating": {
				"score": {
					"values": [1]
				}
			},
			"rating": {
				"comment": {
					"exists": true
				}
			}
		}
	},
	"pagination": {
		"page": 1,
		"limit": 25
	}
}
```

#### Sample response payloads
```js
{
	"chats": [{
		"chat": {
			"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
			"users": [
				// array of "User" objects          
			],
			"thread": {
				// "Thread" object          
			}
		}
	}],
	"pagination": {
		"page": 1,
		"total": 3
	}
}
```

## Get filtered chats

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_filtered_chats` | ✓ | - | - |

#### Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `filters.include_active` | No | |
| `filters.properties.<namespace>.<name>.<filter_type>` | No | |

* `<filter_type>` can take the following values (only one is allowed for single property):
  * `exists` (`bool`)
  * `values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)
  * `exclude_values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)

#### Sample request payload
```js
{
	"filters": {
		"properties": {
			"rating": {
				"score": {
					"values": [1]
				}
			},
			"rating": {
				"comment": {
					"exists": true
				}
			}
		},
		"include_active": false
	}
}
```

#### Sample response payloads
```js
{
	"chats_summary": [{
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
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
		},
		"last_thread_summary": {
			"id": "OE070R0W0U",
			"timestamp": 1473433500,
			"user_ids": ["john@gmail.com"],
			"order": 12417249812721,
			"properties": {
				"routing": {
					"idle": {
						"value": false
					},
					"unassigned": {
						"value": false
					}
				},
				...
			}
		},
		"properties": {
			"routing": {
				"idle": {
					"value": false
				},
				"unassigned": {
					"value": false
				}
			},
			...
		},
		"scopes": {
			// "Scopes" object
		}
	}]
}
```

## Get chat threads
It returns threads that the current agent has access to in a given chat.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_chat_threads` | ✓ | - | - |

#### Request payload:

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes | |
| `thread_ids` | No | |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_ids": ["a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5"]
}
```

#### Sample response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects         
		],
		"threads": [ // optional
			// "Thread" object
		],
		"threads_summary": [{
				"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
				"order": 129846129847
			},
			{
				"thread_id": "b0c22fdd-fb71-40b5-bfc6-a8a0bc3117f6",
				"order": 129846129848
			}
		],
		"properites": {
			// "Properites" object
		},
		"scopes": {
			// "Scopes" object
		}
	}
}
```

## Start chat
Starts a chat.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `start_chat` | ✓ | ✓ | [`incoming_chat_thread`](#incoming-chat-thread) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|---|
| `initial_events` | No | Initial chat events array |

#### Sample request payload
```js
{
	"chat": {
		"properties": {
			"source": {
				"type": "facebook"
			},
			...
		},
		"thread": {
			"events": [{
				"type": "message",
				"custom_id": "12312.301231238591134",
				"text": "hello there",
				"recipients": "all"
			}, {
				"type": "system_message",
				"custom_id": "12312.301231238591135",
				"text": "hello there",
				"recipients": "agents"
			}],
			"properties": {
				"source": {
					"type": "facebook"
				},
				...
			},
			"scopes": {
				// "Scopes" object
			}
		}
	}
}
```

#### Sample response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"thread": {
			// "Thread" object
		}
	}
}
```

## Join chat
Adds an agent to chat.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `join_chat` | ✓ | ✓ | [`chat_users_updated`](#chat-users-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|---|
| `chat_id` | Yes | |
| `agent_ids` | Yes | |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"agent_ids": ["75a90b82-e6a4-4ded-b3eb-cb531741ee0d"]
}
```

No response payload

## Remove from chat
Removes users from chat. If no user is specified, it removes the current user.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `remove_from_chat` | ✓ | ✓ | [`chat_users_updated`](#chat-users-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|---|
| `chat_id` | Yes | |
| `customer_ids` | No | |
| `agent_ids` | No | |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"customer_ids": ["b7eff798-f8df-4364-8059-649c35c9ed0c"],
	"agent_ids": ["75a90b82-e6a4-4ded-b3eb-cb531741ee0d"]
}
```

No response payload

## Send event

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `send_event` | ✓ | ✓ | [`incoming_event`](#incoming-event) <br> or <br> [`incoming_chat_thread`*](#incoming-chat-thread) |

\* `incoming_chat_thread` will be sent instead of `incoming_event` only if the event starts a new thread

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes | Id of the chat that we want to send the message to |
| `event` | Yes | Event object |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"event": {
		"type": "message",
		"text": "hello world",
		"recipients": "agents",
		"custom_id": "12345-bhdsa"
	}
}
```

#### Sample response payload
```js
{
	"thread_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"event": {
		// "Event" object
	}
}
```

## Multicast

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `multicast` | ✓ | ✓ | [`incoming_multicast`](#incoming-multicast) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `scopes` | Yes | <scopes> |
| `content` | Yes | JSON message to be sent |

* `<scopes>` can take the following values:
  * `agents` (object) can take the following values:
	* `all` (`bool` - include all agents)
	* `ids` (`[]string` - array of agent's ids)
	* `groups` (`[]string` - array of group's ids)
  * `customers` (object) can take the following values:
	* `ids` (`[]string` - array of customer's ids)

At least one of `scopes` type (`agents.all`, `agents.ids`, `agents.groups`, `customers.ids`) is required. 

#### Sample request payload
```js
{
	"scopes": {
		"agents": {
			"all": true,
			"ids": ["john@gmail.com", "jane@gmail.com"],
			"groups": [1, 2]
		},
		"customers": {
			"ids": ["50ce4683-22a5-48bf-5317-340f40bf6dfe"]
		}
	},
	"content": {
		"example": {
			"nested": "json"
		}
	}
}
```

No response payload

## Send typing indicator

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `send_typing_indicator` | ✓ | ✓ | - |

#### Request payload

| Request object | Required | Notes  |
|----------------|----------|--------|
| `chat_id`      | Yes      | Id of the chat that we want to send the typing indicator to |
| `recipients`   | No       | `all` (default), `agents` |
| `is_typing`    | Yes      | Bool |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"recipients": "all",
	"is_typing": true
}
```

No response payload

## Ban customer
Bans the customer for a specific period of time. It immediately disconnects all active sessions of this customer and does not accept new ones during the ban lifespan.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `ban_customer` | ✓ | ✓ | [`customer_banned`](#customer-banned) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `customer_id` | Yes | |
| `ban.days` | Yes | |

#### Sample request payload
```js
{
	"customer_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"ban": {
		"days": 5
	}
}
```

No response payload

## Close thread
Closes the thread. Nobody will be able to send any messages to this thread anymore.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `close_thread` | ✓ | ✓ | [`thread_closed`](#thread-closed) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes ||

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5"
}
```

No response payload

## Update chat scopes

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_scopes` | ✓ | ✓ | [`chat_scopes_updated`](#chat-scopes-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes ||
| `add_scopes` | No | Chat scopes to add |
| `remove_scopes` | No | Chat scopes to remove |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"add_scopes": {
		"groups": [1, 2],
		"agents": ["john@doe.com"]
	},
	"remove_scopes": {
		"groups": [3]
	}
}
```

No response payload

## Update agent
Updates agent properties.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_agent` | ✓ | - | [`agent_updated`](#agent-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `agent_id` | No | Current agent is used by default |
| `routing_status` | No | Possible values: `accepting_chats`, `not_accepting_chats` |

#### Sample request payload
```js
{
	"routing_status": "accepting_chats"
}
```

No response payload

## Change push notifications
Change firebase push notifications properties.

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `change_push_notifications` | ✓ | - | - |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `firebase_token` | Yes | Firebase device token |
| `platform` | Yes | OS platform |
| `enabled` | Yes | Enable or disable push notifications for requested token |

* `<platform>` can take the following values:
  * `ios` - iOS operating system
  * `android` - Android operating system

#### Example request payload
```js
{
	"firebase_token": "8daDAD9dada8ja1JADA11",
	"platform": "ios",
	"enabled": true
}
```

No response payload

## Update chat properties

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_properties` | ✓ | ✓ | [`chat_properties_updated`](#chat-properties-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id` | Yes | Id of the chat that we want to set property for |
| `properties` | Yes | Chat properties to set |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"properties": {
		"rating": {
			"score": 2,
			"comment": "Very good, veeeery good"
		},
		...
	}
}
```

No response payload

## Update chat thread properties

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_chat_thread_properties` | ✓ | ✓ | [`chat_thread_properties_updated`](#chat-thread-properties-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id`      | Yes      | Id of the chat that we want to set property for    |
| `thread_id`    | Yes      | Id of the thread that we want to set property for  |
| `properties  ` | Yes      | Chat properties to set |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_id": "EW2WQSA8",
	"properties": {
		"rating": {
			"score": 2,
			"comment": "Very good, veeeery good"
		},
		...
	}
}
```

No response payload

## Update last seen timestamp

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `update_last_seen_timestamp` | ✓ | ✓ | [`last_seen_timestamp_updated`](#last-seen-timestamp-updated) |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `chat_id`      | Yes      |       |
| `timestamp`    | No       |       |

#### Sample request payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"timestamp": 123456789
}
```

#### Sample response payload
```js
{
	"timestamp": 123456789
}
```

## Add auto chat scopes

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `add_auto_chat_scopes` | ✓ | - | - |

#### Request payload

| Request object | Type | Required | Notes |
|----------------|------|----------|-------|
| `scopes` | `object` | Yes | Destination scope |
| `rules` | `object` | Yes | Rules to check for scope auto |
| `description` | `string` | No | Auto chat scopes description |

* `scopes` object:
```js
{
	"scopes": {
		"groups": [1, 2],
		"agents": ["john@doe.com"]
	}
}
```

* `rules` possible rules:
  * `chat_properties.<namespace>.<name>.<filter_type>`
    * `<filter_type>` can take the following values (only one is allowed for single property):
      * `exists` (`bool`)
      * `values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)
      * `exclude_values` (`type[]` - array with specific type for property: `string`, `int` or `bool`)
  * `customer_url.<string_filter_type>`
    * `<string_filter_type>` can take the following values (only one is allowed for single customer_url):
      * `values` (`match_object[]`)
      * `exclude_values` (`match_object[]`)
    * `<match_object>` structure:
      * `value` - value to match (`string`)
      * `exact_match` - if exact match, if set to `false` a `match_object.value` will be matched as substring of `customer_url`
  
#### Sample request payload
```js
{
	"description": "Chats from Facebook or Twitter",
	"scopes": {
		"groups": [1]
	},
	"rules": {
		"chat_properties": {
			"source": {
				"type": {
					"values": ["facebook", "twitter"]
				}
			},
			"facebook": {
				"page_id": {
					"values": ["63121487121"]
				}
			}
		},
		"customer_url": {
			"values": [{
				"value": "livechatinc.com",
				"exact_match": false
			}]
		}
	}
}
```

#### Sample response payload
```js
{
	"auto_chat_scopes_id": "pqi8oasdjahuakndw9nsad9na"
}
```

## Remove auto chat scopes

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `remove_auto_chat_scopes` | ✓ | - | - |

#### Request payload

| Request object | Type | Required | Notes |
|----------------|------|----------|-------|
| `auto_chat_scopes_id` | `string` | Yes | auto chat scopes ID  |

#### Sample request payload
```js
{
	"auto_chat_scopes_id": "pqi8oasdjahuakndw9nsad9na"
}
```

No response payload

## Get auto chat scopes config

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `get_auto_chat_scopes_config` | ✓ | - | - |

No request payload

#### Sample response payload
```js
{
	"auto_chat_scopes_config": [{
		"id": "pqi8oasdjahuakndw9nsad9na",
		"description": "Chats from Facebook or Twitter",
		"scopes": {
			"groups": [1]
		},
		"rules": {
			"chat_properties": {
				"source": {
					"type": {
						"values": ["facebook", "twitter"]
					}
				},
				"facebook": {
					"page_id": {
						"values": ["63121487121"]
					}
				}
			},
			"customer_url": {
				"values": [{
					"value": "livechatinc.com",
					"exact_match": false
				}]
			}
		}
	}]
}
```

## Upload image

| Action | RTM API | Web API | Push message |
| --- | :---: | :---: | :---: |
| `upload_image` | - | ✓ | - |

#### Request payload

| Request object | Required | Notes |
|----------------|----------|-------|
| `payload.image`      | Yes      | max 10MB |

* Content-Type header in form `Content-Type: multipart/form-data; boundary=<boundary>` is required.

#### Sample request payload
```
	payload.image=test.png
```

Sample response payload
```js
{
	"url": "https://cdn.chatio-static.com/api/file/chatio/img/24434343/dmkslfmndsfgds6fsdfsdnfsd.png",
	"path": "24434343/dmkslfmndsfgds6fsdfsdnfsd.png"
}
```

Note:
* `url` is a ready-to-use, temporary URL, but it can expire in the future
* `path` should be used for database and must be appended to `base_url`
* `base_url` is `https://cdn.chatio-static.com/api/file/chatio/img`


# Pushes
Server => Client methods are used for keeping the application state up-to-date. They are available only in `websocket` transport.

## Incoming chat thread

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_chat_thread` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `thread`       |          |

#### Sample response payload
```js
{
	"chat": {
		"id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
		"users": [
			// array of "User" objects
		],
		"properties": {
			"source": {
				"type": "facebook"
			},
			...
		},
		"thread": {
			// "Thread" object
		}
	}
}
```

## Chat users updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `chat_users_updated` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `updated_users`       |          |

#### Sample response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"updated_users": {
		"customers": {
			"added": [
				// array of "User > Customer" objects
			],
			"removed_ids": []
		},
		"agents": {
			"added": [
				// array of "User > Agent" objects
			],
			"removed_ids": ["75a90b82-e6a4-4ded-b3eb-cb531741ee0d"]
		}
	}
}
```

## Incoming event

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_event` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `event`       |          |

#### Sample response payload
```js
{
	"chat_id": "85f3bfc9-06c1-434e-958b-2a5239b07de8",
	"event": {
		// "Event" object
	}
}
```

## Incoming multicast

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_multicast` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `author_id`       |          |
| `content`       |          |


#### Sample response payload
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

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_typing_indicator` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `typing_indicator`       |          |

#### Sample response payload
```js
{
	"chat_id": "85f3bfc9-06c1-434e-958b-2a5239b07de8",
	"typing_indicator": {
		// "Typing indicator" object
	}
}
```

## Incoming sneak peek

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `incoming_sneak_peek` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `sneak_peek`       |          |

#### Sample response payload
```js
{
	"chat_id": "85f3bfc9-06c1-434e-958b-2a5239b07de8",
	"sneak_peek": {
		// "Sneak peek" object
	}
}
```

## Customer banned

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `customer_banned` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `customer_id`       |          |
| `ban.days`       |          |

#### Sample response payload
```js
{
	"customer_id": "b7eff798-f8df-4364-8059-649c35c9ed0c",
	"ban": {
		"days": 5
	}
}
```

## Thread closed

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `thread_closed` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `thread_id`       |          |
| `user_id`       | Missing if thread was closed by router |

#### Sample response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"thread_id": "b0c22fdd-fb71-40b5-bfc6-a8a0bc3117f6",
	"user_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d" // optional
}
```

## Chat scopes updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `chat_scopes_updated` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `scopes_added`       |          |
| `scopes_removed`       |          |

#### Sample response payload
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

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `customer_updated` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `customer`       |          |

#### Sample response payload
```js
{
	"chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
	"customer": {
		// "User > Customer" object
	}
}
```

## Agent updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `agent_updated` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `agent_id`       |          |
| `routing_status`       |          |

#### Sample response payload
```js
{
	"agent_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"routing_status": "accepting_chats"
}
```

## Agent disconnected

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `agent_disconnected` | ✓ | - |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `reason`       |          |

#### Sample response payload
```js
{
	"reason": "access_token_revoked"
}
```

#### Possible reasons
| Type | Notes |
|--------|----------------|
| `access_token_revoked` | Agent access token has been revoked |
| `license_expired` | License has expired |

## Chat properties updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `chat_properties_updated` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `properties`       |          |

#### Sample response payload
```js
{
	"chat_id": "123-123-123-123",
	"properties": {
		"rating": {
			"score": {
				"value": 1
			},
			"comment": {
				"value": "Very good, veeeery good"
			}
		},
		...
	}
}
```

## Chat thread properties updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `chat_thread_properties_updated` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `chat_id`       |          |
| `thread_id`       |          |
| `properties`       |          |

#### Sample response payload
```js
{
	"chat_id": "123-123-123-123",
	"thread_id": "E2WDHA8A",
	"properties": {
		"rating": {
			"value": {
				"value": 1
			},
			"comment": {
				"value": "Very good, veeeery good"
			}
		},
		...
	}
}
```

## Last seen timestamp updated

| Action | RTM API | Webhook |
| --- | :---: | :---: |
| `last_seen_timestamp_updated` | ✓ | ✓ |

#### Push payload

| Object         | Notes    |
|----------------|----------|
| `user_id`       |          |
| `chat_id`       |          |
| `timestamp`       |          |

#### Sample response payload
```js
{
	"user_id": "75a90b82-e6a4-4ded-b3eb-cb531741ee0d",
	"chat_id": "123-123-123-123",
	"timestamp": 123456789
}
```
