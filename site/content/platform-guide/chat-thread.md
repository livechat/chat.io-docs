---
title: "Chat and thread"
weight: 10
---

# Chat and thread

## Basics

In our system each chat is divided into threads. Threads are standalone parts of a chat and can contain events. Multiple users (customers or agents) can participate in a chat and every user can have multiple chats at the same time.

New threads within a chat are created on the server side, the algorithm of this is discussed below in the [Advanced](#advanced) section.

![Chats and Threads](../images/chats.png "chats and threads")

Events are portions of data which can be sent to a chat (e.g. in messages). See the next section of this guide for details (coming soon).

## Getting chats

If you log in to the Agent or Customer API you will receive one of the following in the login response: chats_summary or last_chats_summary.  Both of these objects contain some chat and thread IDs - they can be used to retrieve the chat history.

Depending on whether you are a Customer or an Agent, you have to use different methods to retrieve your chat history.

**Agent methods**:

 - [get_archives](../../agent-api/client-server#get-archives)
 - [get_filtered_chats](../../agent-api/client-server#get-filtered-chats)
 - [get_chat_threads](../../agent-api/client-server#get-chat-threads)

**Customer methods**:

 - [get_chats_summary](../../customer-api/client-server#get-chats-summary)
 - [get_chat_threads](../../customer-api/client-server#get-chat-threads)
 - [get_chat_threads_summary](../../customer-api/client-server#get-chat-threads-summary)

## Chatting

You can start a chat via the [start_chat](../../agent-api/client-server#start-chat) method both on the Customer and Agent side. If you are an agent you can also [join](../../agent-api/client-server#join-chat) a chat. When you are in a chat you can send events to it via [send_event](../../agent-api/client-server#send-event) method.

Currently all new events and chats are sent to all agents within the license. In the future *scopes* will define which groups of users have access to chats/events and other types of data. (currently scopes serve another purpose and will be documented in this guide soon)

## Pushes

 If a chat or a thread is created or closed when you're logged in, we will send you server push messages (in both APIs):

 - [incoming_chat_thread](../../agent-api/server-client#incoming-chat-thread)
 - [thread_closed](../../agent-api/server-client#thread-closed)
 - [chat_users_updated](../../agent-api/server-client#chat-users-updated)

## Advanced

The following rules apply:

 - one of the threads in a chat can be the **active thread** - if you send events to the chat your events will be added to this thread. Only the last thread can be the active one.
 - chats are not continous, there can be empty (time) spaces between threads
 - if there is no active thread in a chat (e.g. the last active thread has been closed), sending event to that chat will start a new thread (the annotation event is an exception here, it will be added at the end of the last thread)
 - when a new chat is started (via [start_chat](../../agent-api/client-server#start-chat)), a new thread is created within that chat
 - the algorithm which decides how the chats are distributed between the agents is called routing and is documented in the [Routing](../routing.md) section
