# Internal documentation

- [Internal documentation](#internal-documentation)
  - [Default properties](#default-properties)
  - [Auto access rules](#auto-access-rules)
      - [Add auto access rules](#add-auto-access-rules)
        - [Example request payload](#example-request-payload)
        - [Example response payloads](#example-response-payloads)
          - [Success](#success)
      - [Get auto access rules config](#get-auto-access-rules-config)
        - [Example request payload](#example-request-payload-1)
        - [Example response](#example-response)
          - [Success](#success-1)
      - [Remove auto access rules](#remove-auto-access-rules)
        - [Example request payload](#example-request-payload-2)
        - [Example response payloads](#example-response-payloads-1)
          - [Success](#success-2)
  - [Private methods authorization](#private-methods-authorization)
  - [Remove client data](#remove-client-data)
        - [Example request payload](#example-request-payload-3)
        - [Example response payloads](#example-response-payloads-2)
          - [Success](#success-3)
  - [Private webhook administration](#private-webhook-administration)
    - [Register webhooks](#register-webhooks)
        - [Example response payloads](#example-response-payloads-3)
          - [Success](#success-4)
    - [Unregister webhooks](#unregister-webhooks)
        - [Example request payload](#example-request-payload-4)
        - [Example response payload](#example-response-payload)
          - [Success](#success-5)

## Default properties

For each license there are added some properties for livechat products.

| Namespace       | Property                    | Type     | Access                                                                 | Domain                |
| --------------- | --------------------------- | -------- | ---------------------------------------------------------------------- | --------------------- |
| `bot_engine`    | `muted_bots`                | `string` | rw for agent in chat                                                   |                       |
| `chatio_app`    | `forward_immediately`       | `bool`   | rw for agent and customer in event                                     |                       |
|                 | `forwarded_messages`        | `string` | rw for agent and customer in thread                                    |                       |
|                 | `recipient`                 | `string` | rw for agent and customer in event                                     |                       |
|                 | `sender`                    | `string` | rw for agent and customer in event                                     |                       |
|                 | `source`                    | `string` | rw for agent and customer in event                                     |                       |
|                 | `symbol`                    | `string` | rw for agent in chat                                                   |                       |
| `facebook`      | `page_id`                   | `string` | r for agent in chat and thread, w for customer in chat and thread      |                       |
|                 | `page_name`                 | `string` | r for agent in chat and thread, w for customer in chat and thread      |                       |
| `invitation`    | `url`                       | `string` | r for agent in chat and thread, w for customer in chat and thread      |                       |
| `lc2`           | `chosen_group_id`           | `int`    | r for agent and rw for customer in event                               | range from `0`        |
|                 | `file_safety_confirmation`  | `bool`   | rw for agent in event                                                  |                       |
|                 | `form_type`                 | `string` | r for agent and rw for customer in event                               | `prechat`, `postchat` |
|                 | `greeting_id`               | `int`    | w for customer in thread, r for agent and customer in thread and event |                       |
|                 | `greeting_unique_id`        | `string` | w for customer in thread, r for agent and customer in thread and event |                       |
|                 | `prechat_group_id`          | `int`    | w for customer in event                                                |                       |
|                 | `queue_pos`                 | `int`    | r for agent and customer in thread                                     |                       |
|                 | `queue_waiting_time`        | `int`    | r for agent and customer in thread                                     |                       |
|                 | `welcome_author_id`         | `string` | rw for customer in thread and chat                                     |                       |
|                 | `welcome_message`           | `bool`   | r for agent and customer in event                                      |                       |
|                 | `welcome_text`              | `string` | rw for customer in thread and chat                                     |                       |
| `notifications` | `subscribed_agent_ids`      | `string` | rw for agent in chat                                                   |                       |
| `rating`        | `comment`                   | `string` | r for agent and rw for customer in chat, thread and event              |                       |
|                 | `score`                     | `int`    | r for agent and rw for customer in chat, thread and event              | `0`, `1`              |
| `routing`       | `idle`                      | `bool`   | r for agent                                                            |                       |
|                 | `ignore_agents_routing`     | `bool`   | rw for agent and customer in chat                                      |                       |
|                 | `pinned`                    | `bool`   | r for agent in thread, rw for agent in chat                            |                       |
|                 | `was_pinned`                | `bool`   | r for agent in chat                                                    |                       |
|                 | `start_url`                 | `string` | r for agent and customer in thread                                     |                       |
|                 | `referrer`                  | `string` | r for agent in thread                                                  |                       |
|                 | `transcript_email`          | `string` | r for agent and rw for customer in thread                              |                       |
|                 | `unassigned`                | `bool`   | r for agent in thread and chat                                         |                       |
|                 | `unreplied`                 | `bool`   | r for agent in thread                                                  |                       |
|                 | `last_transfer_timestamp`   | `int`    | r for agent in thread                                                  |                       |
|                 | `continuous`                | `bool`   | r for agent and customer in chat and thread                            |                       |
|                 | `email_follow_up`           | `bool`   | rw for customer in chat, r for agent in chat                           |                       |
| `source`        | `type`                      | `string` | r for customer and agent in thread, rw for customer and agent in chat  |                       |
|                 | `client_id`                 | `string` | r for agent and customer in chat, thread and event                     |                       |
|                 | `customer_client_id`        | `string` | r for agent and customer in chat and thread                            |                       |
| `supervising`   | `agent_ids`                 | `string` | rw for agent in chat                                                   |                       |
| `url_details`   | `description`               | `string` | rw for agent and customer in event                                     |                       |
|                 | `image_height`              | `int`    | rw for agent and customer in event                                     |                       |
|                 | `image_width`               | `int`    | rw for agent and customer in event                                     |                       |
|                 | `image_url`                 | `string` | rw for agent and customer in event                                     |                       |
|                 | `title`                     | `string` | rw for agent and customer in event                                     |                       |
|                 | `url`                       | `string` | rw for agent and customer in event                                     |                       |
| `status`        | `delivered`                 | `bool`   | rw for agent and customer in event                                     |                       |
| `test`          | `bool_property`             | `bool`   | rw for everyone everywhere                                             |                       |
|                 | `int_property`              | `bool`   | rw for everyone everywhere                                             |                       |
|                 | `string_property`           | `bool`   | rw for everyone everywhere                                             |                       |
|                 | `tokenized_string_property` | `bool`   | rw for everyone everywhere                                             |                       |

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
