## Introduction

Version 3.2 of the Configuration API introduces new property locations - `license` and `group` - as well as new endpoints to set and get their values.

### Methods

#### Set license properties

**Endpoint**: `set_license_properties`

**Permissions**:
* N/A. For requesters whose client ID is the same as namespace, setting properties' values is always allowed. For everybody else, it depends on each property configuration (Locations.License.Access.Agent.Write)

| Request object | Type     | Required | Notes                                                                           |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------- |
| `properties`   | `object` | Yes      | An object with namespaces as keys and properties (grouped in objects) as values |


##### Example request payload

```js
{
    "properties": {
        "58737b5829e65621a45d598aa6f2ed81": {
            "my_integer_property_name": 123,
            "my_string_property_name": "string value",
            "my_boolean_property_name": true,
            "another_boolean_property_name": false
        }
    }
}
```

* Properties' values should match their configured types

##### Example response payloads

###### Success

```js
{}
```

#### Get license properties

**Endpoint**: `get_license_properties`

**Permissions**:
* N/A. For requesters whose client ID starts with `namespace_prefix`, getting properties' values is always allowed. For everybody else, it depends on each property configuration (Locations.License.Access.Agent.Read)

| Request object     | Type     | Required | Notes                       |
| ------------------ | -------- | -------- | --------------------------- |
| `namespace_prefix` | `string` | No       | Properties namespace prefix |
| `name_prefix`      | `string` | No       | Properties name prefix      |


##### Example request payload

```js
{
    "namespace_prefix": "5",
    "name_prefix": "my"
}
```

##### Example response payloads

###### Success

```js
{
    "58737b5829e65621a45d598aa6f2ed81": {
        "my_integer_property_name": 123,
        "my_string_property_name": "string value",
        "my_boolean_property_name": true
    }
}
```

#### Set group properties

**Endpoint**: `set_group_properties`

**Permissions**:
* N/A. For requesters whose client ID is the same as namespace, setting properties' values is always allowed. For everybody else, it depends on each property configuration (Locations.Group.Access.Agent.Write)

| Request object | Type     | Required | Notes                                                                           |
| -------------- | -------- | -------- | ------------------------------------------------------------------------------- |
| `group_id`     | `number` | Yes      | Group ID for which to set the properties                                        |
| `properties`   | `object` | Yes      | An object with namespaces as keys and properties (grouped in objects) as values |


##### Example request payload

```js
{
    "group_id": 10,
    "properties": {
        "58737b5829e65621a45d598aa6f2ed81": {
            "my_integer_property_name": 123,
            "my_string_property_name": "string value",
            "my_boolean_property_name": true,
            "another_boolean_property_name": false
        }
    }
}
```

* Properties' values should match their configured types

##### Example response payloads

###### Success

```js
{}
```

#### Get group properties

**Endpoint**: `get_group_properties`

**Permissions**:
* N/A. For requesters whose client ID starts with `namespace_prefix`, getting properties' values is always allowed. For everybody else, it depends on each property configuration (Locations.Group.Access.Agent.Read)

| Request object     | Type      | Required | Notes                       |
| ------------------ | --------- | -------- | --------------------------- |
| `group_id`         | `number`  | Yes      | Group ID                    |
| `namespace_prefix` | `string`  | No       | Properties namespace prefix |
| `name_prefix`      | `string`  | No       | Properties name prefix      |


##### Example request payload

```js
{
    "group_id": 10,
    "namespace_prefix": "5",
    "name_prefix": "my"
}
```

##### Example response payloads

###### Success

```js
{
    "58737b5829e65621a45d598aa6f2ed81": {
        "my_integer_property_name": 123,
        "my_string_property_name": "string value",
        "my_boolean_property_name": true
    }
}
```
