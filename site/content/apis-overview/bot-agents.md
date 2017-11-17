---
weight: 50
---

# BOT Agents

* BOT Agent enables writing integrations using agent-api to communicate in chats as a regular Agent.

* Logged in BOT Agent is connected to agent SSO access token that creates/updates the BOT and is being logged out when the access token is revoked.

* Each BOT Agent is a resource owned by an application in developers platform identified by `client_id`. By "My BOT Agents" the BOTs owned by application with given `client_id` is meant.

## Differences from regular Agent

* you can not log in using BOT Agent account
* you can not set password for BOT Agent account
* BOT Agent does not have an email - agent_id is a random hash

## Configuring bot agents

You can create and manage bot agents using configuration api [here](https://www.chat.io/docs/configuration-api/api-reference/v0.3/#bot-agent)

## Notes

We currently don't have chat.io group management. All agents belong to group 0 by default.