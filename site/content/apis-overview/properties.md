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

### Property value domain




## Example

In this example we want to use properties to create basic chat rating. For this purpose we need property namespace with two properties: rating_score and rating_comment. Those properties should be writable by customer, and readable

First we need to create our namespace using Configuration API.

```js

```

If you already have property namespace you can create those properties with method `add_property`:

```js

```

Then