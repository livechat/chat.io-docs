---
title: 'Customer API Guide'
weight: 10
---

# Introduction

## Overview

With Customer API you can join the conversation as *a customer*. It has a different set of methods than the [Agent API](/docs/customer-api). The main reason to have separate APIs for both Customer and Agent is their specific use cases.

## Use cases

The basic use case for this tool is to post messages as a customer. This API is used for chat.io chat widget.

You can use Customer API to build your very own chat widget or just perform chats in the name of a customer.

## Important notes

To use this tool you need to have basic knowledge about REST or websocket APIs, OAuth 2.0 protocol and your technology of choice. We've got examples ready in JavaScrip, Go and Pyhon.

If you want to perform a chat from the agent perspective, you should use [Agent API](/docs/customer-api).

Keep in mind this API is under heavy development. We introduce changes every month. If you want to stay updated, follow the changelog below.

# Getting started

## Prerequisites

To start off follow these steps:

1. Sign up or sign in to the [Developers Console](https://console.chat.io/).
2. Create a new app ("Backend" type).
3. Copy the Client Secret and Client ID.