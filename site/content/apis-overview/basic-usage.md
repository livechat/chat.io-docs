---
weight: 20
---

# Basic usage 

Probably the most basic use cases are listing or performing chats. This section describes the general concept of both. For working examples in JavaScript, Go and Python head to the API references.

## Listing chats

When you log in to the Agent or Customer API you will receive one of the following in the login response: `chats_summary` or `last_chats_summary`. These objects contain some chat and thread IDs. Those IDs can be used to retrieve the chat history.

If you want to retrieve the chats from the customer perspective, you should use [Customer API](../customer-api). When you log in as an agent, you should go with [Agent API](../agent-api).

## Performing a chat

You can start a chat both as a customer and agent. If you are an agent you can also [join](../agent-api/api-reference/#join-chat) a chat. When you are in a chat you can send events to it via [send_event](../agent-api/api-reference/#send-event) method.

Currently all new events and chats are sent to all agents within the license. In the future *scopes* will define which groups of users have access to chats/events and other types of data.