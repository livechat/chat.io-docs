---
title: 'Customer API Guide'
weight: 10
slug: '/'
menu: 
    customer_api: 
        identifier: "Guide"
---

# Introduction

## Overview

With Customer API you can join the conversation as **a customer**. It has a different set of methods than the [Agent API](./agent-api). The main reason to have separate APIs for both Customer and Agent is their specific use cases. 

## Use cases

The basic use case for this tool is to post messages as a customer. This API is used for chat.io chat widget.

You can use Customer API to build your very own chat widget or just perform chats in the name of a customer.

## Important notes

To use this tool you need to have basic knowledge about REST or websocket APIs, OAuth 2.0 protocol and your technology of choice. We've got examples ready in JavaScrip, Go and Pyhon.

If you want to perform a chat from the agent perspective, you should use [Agent API](./agent-api).

Keep in mind this API is under heavy development. We introduce changes every month. If you want to stay updated, follow the changelog below.

# Getting started

## Prerequisites

To start off follow these steps:
1. Sign up or sign in to the [Developers Console](https://console.chat.io/).
2. Create a Backend app.
3. Copy the Client Secret and Client ID

<!--
## Working example

>_I've prepared the workspace. What do I need to do, to see it running?_

There is a ready-to-use example... To see the online demo... Do X to see it working...

# Basic usage

>_Now, once I saw it in action, I want to see more._

## Extended example

>_What else can I do with this tool?_

To better understand the power of this tool, check out following guides. To explore all of the functionalites, go to the API reference... 

### Guide on creating

...

### Using this tool to

...

### Guide on preparing

...

# Advanced usage

>_I've already worked with this tool. I've mastered its basic use case. I want more._

## Advanced example
>_What are the most advanced / complex / hard use cases of this tool?_

Although this tool is dedicated to... we've seen people successfully using it to... To find out the advanced use cases, check this guides below.

### Guide on building your own

...

### Creating X from the ground up

...

## How it works
>_How this tool works internally? Can I modify or extend this tools' functionalities?_

If you want to tailor this tool for your very specific use case...

# Help and Support

>_I still have some questions. I've scrolled here impatiently. Where should I go?_

## Feedback

>_I ~hate~ love this tool! Where can I leave some feedback?_

The best way to leave the feedback is... We're always open for changes... Let us know if...

## Contributing

>_How can I help to improve this tool?_

If you want to help us out...

# API reference

>_I'm here every day for the last week. Just let me know what this method does._

## Methods, Callbacks, Objects definitions

>_I expect here to see the full technical index of all methods, callbacks and objects._
-->