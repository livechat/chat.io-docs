# Internal documentation

- [Internal documentation](#internal-documentation)
  - [Undocumented default properties](#undocumented-default-properties)
  - [Private methods authorization](#private-methods-authorization)
  - [Remove client data](#remove-client-data)
        - [Example request payload](#example-request-payload)
        - [Example response payloads](#example-response-payloads)
          - [Success](#success)
  - [Private webhook administration](#private-webhook-administration)
    - [Register webhooks](#register-webhooks)
        - [Example response payloads](#example-response-payloads-1)
          - [Success](#success-1)
    - [Unregister webhooks](#unregister-webhooks)
        - [Example request payload](#example-request-payload-1)
        - [Example response payload](#example-response-payload)
          - [Success](#success-2)

## Undocumented default properties

These are default properties not documented in public docs.

| Namespace     | Property             | Type     | Access                             | Note                                                             |
| ------------- | -------------------- | -------- | ---------------------------------- | ---------------------------------------------------------------- |
| `lc2`         | `queue_pos`          | `int`    | r for agent and customer in thread | needed in v3.1, in v3.2+ replaced by native `queue` field        |
|               | `queue_waiting_time` | `int`    | r for agent and customer in thread | needed in v3.1, in v3.2+ replaced by native `queue` field        |
| `supervising` | `agent_ids`          | `string` | rw for agent in chat               | AA uses it - maybe they could use their own private prop for it? |

## Private methods authorization

For private methods, license ID and client ID are taken from SSO token, via `Authorization` header.  If that header is not set, `X-License-Id` and `X-Client-Id` headers are used.  Otherwise, the call will fail.


## Remove client data

**Endpoint**: `remove_client_data`

**Version**: 3.1 and up

See [private authorization](#private-methods-authorization).


##### Example request payload
```js
{
}
```

##### Example response payloads
###### Success
```js
{
}
```

## Private webhook administration

### Register webhooks

**Endpoint**: `register_webhooks`

**Version**: 3.2 and up

See [private authorization](#private-methods-authorization).

| Request object                                      | Type       | Required | Notes                                                                                    |
| --------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------- |
| `url`                                               | `string`   | Yes      | Single url for all registed webhooks                                                     |
| `webhooks`                                          | `object[]` | Yes      | Required to be non-empty                                                                 |
| `webhooks[].description`                            | `string`   | No       | Webhook description (max length is 255 chars)                                            |
| `webhooks[].action`                                 | `string`   | Yes      | Triggerring action                                                                       |
| `webhooks[].secret_key`                             | `string`   | Yes      | Secret sent in webhooks to verify webhook source (max length is 255 chars)               |
| `webhooks[].filters`                                | `object`   | No       | Filters to check if webhook should be triggered                                          |
| `webhooks[].filters.author_type`                    | `string`   | No       | Possible values: `customer`, `agent`                                                     |
| `webhooks[].filters.only_my_chats`                  | `bool`     | No       | Trigger webhooks only for chats with property `source.client_id` equal to my `client_id` |
| `webhooks[].filters.chat_member_ids`                | `object`   | No       | Only one filter (`agents_any` or `agents_exclude`) is allowed                            |
| `webhooks[].filters.chat_member_ids.agents_any`     | `[]string` | No       | If any specified agent is in chat, webhook will be triggered                             |
| `webhooks[].filters.chat_member_ids.agents_exclude` | `[]string` | No       | If any specified agent is in chat, webhook will not be triggered                         |
| `webhooks[].additional_data`                        | `[]string` | No       | Additional data that will arrive with webhook                                            |

Meaning of `webhooks` elements is identical as in public `register_webhook` method.

##### Example response payloads
```js
{
  "url": "https://example.com/webhook",
  "webhooks": [
    {
      "action": "incoming_chat_thread",
      "secret_key": "s0sekritW0W",
      "filters": {
        "chat_member_ids": {
          "agents_any": ["johndoe@mail.com"]
        }
      },
      "additional_data": ["chat_properties"]
    }
    // ...
  ]
}
```

###### Success

```js
{
  "webhook_ids": ["pqi8oasdjahuakndw9nsad9na", "a658371f608e9a05967d57256f100140"]
}
```

### Unregister webhooks

**Endpoint** `unregister_webhooks`

**Version**: 3.2 and up

See [private authorization](#private-methods-authorization).

##### Example request payload
```js
{
  "webhook_ids": ["pqi8oasdjahuakndw9nsad9na", "a658371f608e9a05967d57256f100140"]
}
```

##### Example response payload
###### Success
```js
{
}
```
