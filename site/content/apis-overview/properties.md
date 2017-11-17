---
weight: 70
---

# Properties

Properties are simple key-value storage. They can be set within chat, thread or event. They appear in those objects in following format:

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

Here `routing` is property *namespace* and `pinned` or `chatting` is property name.

## Types

There are three property types:
* int (int32)
* bool
* string

## Note about namespaces

Namespaces are used here because we plan to add configurable properties. Those properties will be configurable whithin your namespace named with your client_id.