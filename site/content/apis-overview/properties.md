---
weight: 70
---

# Properties

Properties are simple key-value storages. They can be set within a chat, a thread or an event. They appear in these objects in the following format:

```js
{
    "properties": {
        "routing": {
            "pinned": true,
            "count": 3
        }
    }
}
```

In this example `routing` is a namespace, while `pinned` and `count` are properties names.

## Configuration

Properties are configurable via [Configuration API](https://www.chat.io/docs/configuration-api/). They can be created whithin a license and they are groupped in namespaces, wchich help distinguish wchich property belong to who.
If you create property namespace, this namespace will be named after your application id.

There are several things that you can configure

### Property types

There are three property types:

* `int` (int32)
* `bool`
* `string`
* `tokenized_string`

#### Note about tokenized_string

`tokenized_string` is string that is splited to tokens before indexing in our search engine. This can be usefull if you want to use that property as filter in methods like [get_archives](https://www.chat.io/docs/agent-api/api-reference/#get-archives).

### Property locations

Properties can be set whithin three locations:
* chat
* thread
* event

You can configure access to properties whithin those locations. You can for example create property that is visible for agents whithin chat and thread, and not visible within event. (for more see [Configuration API docs](https://www.chat.io/docs/configuration-api/api-reference/#properties))

### Property allowed value set

Property allowed value set can be configured in 2 different ways:
* by defining a set of values allowed in this property explicitly (for example `[1, 2, 3]`)
* by defining a range, all values in this range are allowed in this property (for example range from `1` to `3`)

## Example

In this example we want to use properties to create basic chat rating. For this purpose we need property namespace with two properties: rating_score and rating_comment. Those properties should be writable by customer, and readable by agent within chat.

First we need to create our namespace using Configuration API.

```
curl -v https://api.chat.io/configuration/properties/create_namespace \
    -H "Content-Type: application/json" \
    -H "Authorization Bearer c5e4f61e1a6c3b1521b541bc5c5a2ac5" \
    -X POST -d '
{
    "description": "this is my test namespace"
    "properties" : {
        "rating_score" : {
            "type" : "int",
            "locations" : {
                "chat" : {
                    "access" : {
                        "agent" : {
                            "read" : true,
                            "write" : false
                        },
                        "customer" : {
                            "read" : true,
                            "write" : true
                        }
                    }
                }
            }
        },
        "rating_comment" : {
            "type" : "string",
            "locations" : {
                "chat" : {
                    "access" : {
                        "agent" : {
                            "read" : true,
                            "write" : false
                        },
                        "customer" : {
                            "read" : true,
                            "write" : true
                        }
                    }
                }
            }
        }
    }
}'
```

If you already have property namespace you can create those properties with method `add_property`:

```js

```

Now, you can set those properties whithin existing chat from customer perspective via method [update_chat_properties](https://www.chat.io/docs/customer-api/api-reference/#update-chat-properties)
```
curl -v https://api.chat.io/customer/v0.5/action/update_chat_properties \
    -H "Content-Type: application/json" \
    -H "Authorization Bearer c5e4f61e1a6c3b1521b541bc5c5a2ac5" \
    -X POST -d ' \
    {
        "chat_id": "a0c22fdd-fb71-40b5-bfc6-a8a0bc3117f5",
        "properties": {
            "my_namespace": {
                "rating_score": 10,
                "rating_comment": "This guy is a support hero, he helped me a lot."
            }
        }
    }'
```

And they will appear from agent perpective either in chat object as return element (in example response from [get_archives](https://www.chat.io/docs/agent-api/api-reference/#get-archives) method)

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
            "properties": {
                "my_namespace": {
                    "rating_score": 10,
                    "rating_comment": "This guy is a support hero, he helped me a lot.",
                }
                //other namespaces
            }
		}
	}],
	"pagination": {
		"page": 1,
		"total": 3
	}
}
```

 or in push [chat_properties_updated](https://www.chat.io/docs/customer-api/api-reference/#chat-properties-updated)

 ```js
{
    "chat_id": "123-123-123-123",
	"properties": {
		"my_namespace": {
            "rating_score": 10,
            "rating_comment": "This guy is a support hero, he helped me a lot.",
        }
	}
}
 ```