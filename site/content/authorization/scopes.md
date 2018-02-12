---
weight: 40
---

# Scopes list

## Chats scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `chats--all:read` | normal | Read access for all license chats |
| `chats--my:read` | normal | Read access for the chats I belong to |
| `chats.conversation--all:write`| normal | Write access for conversation data of all license chats |
| `chats.conversation--my:write` | normal | Write access for conversation data of chats I belong to |
| `chats.meta--all:write` | administrator | Write access for meta data of all license chats |
| `chats.meta--my:write` | normal | Write access for meta data of chats I belong to |

## Multicast scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `multicast:write` | normal | Access for multicast data to agents or customers |

## Customers scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `customers.ban:write` | normal | Access for banning customers |
| `customers.identity--manage` | administrator | Access for managing customers identities |
| `customers:read` | normal | Read access for customers |
| `customers:write` | normal | Write access for customers |

## Agents scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `agents--my:write` | normal | Write access for my profile configuration |
| `agents--all:write` | administrator | Write access for all agents profiles configuration |


## Agents scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `auto_chat_scopes:read` | administrator | Read access for auto chat scopes configuration |
| `auto_chat_scopes:write` | administrator | Write access for auto chat scopes configuration |


## Properties scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `properties--my:read` | administrator | Read access for chat/thread/events properties configuration (only in my namespace) |
| `properties--my:write` | administrator | Write access for chat/thread/events properties configuration (only in my namespace) |
| `properties--all:read` | administrator | Read access for chat/thread/events properties configuration (all in license) |


## Webhooks scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `webhooks--my:read` | administrator | Read access for webhooks configuration (only my webhooks) |
| `webhooks--my:write` | administrator | Write access for webhooks configuration (only my webhooks) |
| `webhooks--all:read` | administrator | Read access for webhooks configuration (all in license) |
| `webhooks--all:write` | administrator | Write access for webhooks configuration (all in license, delete only) |


## Bot agents scopes

| Scope | permission | Description |
|-------|-------------|------------|
| `agents-bot--my:read` | administrator | Read access for bot agents configuration (only my bot agents) |
| `agents-bot--my:write` | administrator | Write access for bot agents configuration (only my bot agents) |
| `agents-bot--all:read` | administrator | Read access for bot agents configuration (all in license) |
| `agents-bot--all:write` | administrator | Write access for bot agents configuration (all in license, delete only) |
