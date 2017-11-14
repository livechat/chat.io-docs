# Introduction

chat.io uses [OAuth 2.0](https://oauth.net/2/) protocol for **authentication** and **authorization** for all of its services. Before you continue, make sure you understand the following difference:

* **Authentication** is making sure that somebody really is who they say they are. <br/>_E.g.: Checking your passport at the security check is authentication._
* **Authorization** is assigning rules about who is allowed to do what. <br/>_E.g.: Allowing you to take first class seat is authorization._

## Overview

In terms of chat.io apps, authentication is when you check the user credentials to see if they are signed in. Authorization is when you look up whether you allow them to do something. There are [five authorization flows](#authorization-flows) available for different ways of interacting with chat.io APIs. 

## Basic use cases

### Authorizing REST API calls

The most popular tool used by developers are [Customer API](./customer-api) and [Agent API](./agent-api). Calling API methods on behalf of chat.io user is as simple as including `Authorization: Bearer <access_token>` HTTP header in each call. Find out how to acquire the `access_token` in the sections below.

### Authentication service

You can authenticate users of your app using chat.io authorization flows. You can leverage the existing chat.io user base and distribute apps for the community of chat.io users without the need of building your own authentication service.

### Connect with chat.io

Let's say you have a service which can import chat data from the external sources. You can use a [Sign in with chat.io SDK](#sign-in-with-chatio) to create something like _"Connect with chat.io"_ button. This way your users can connect their chat.io accounts to your service with just a few clicks.