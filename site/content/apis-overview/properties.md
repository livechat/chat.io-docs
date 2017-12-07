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

<div class="callout type-info"><strong>Namespaces</strong> are used here because we plan to add configurable properties. These properties will be editable within your namespace with your client_id.</div>

## Property types

There are three property types:

* int (int32)
* bool
* string

