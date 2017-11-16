---
weight: 70
---

# Properties

Properties are simple key-value storage. They can be set within chat, thread or event. They appear in those objects in following format:

```
"properties": {
    "routing": {
        "pinned": true,
        "chatting": false
    }
}
```

Here `routing` is *namespace* and `pinned` is property name.

You can create your own namespace for your integration [here]().

## Property types

Each property has one of the folowing types:
- int (int32)
- bool
- string

## Property value domain

Domain of the property can be specified by two constructions:
- domain - a set of values that property can be set to
- range - a range of values from one to other (only for numeric types)

## Locations

All properties can be configured to have different access settings for agent and customer in different locations. Currently configurable properties are supported in:
- chat
- thread
- event