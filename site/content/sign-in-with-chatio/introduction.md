---
weight: 10
---

# Introduction

## User flow

"Sign in with chat.io" flow is the easiest way to get access to basic information about chat.io users. It allows you to quickly build an app that can access different parts of chat.io account.

1. User starts the flow by clicking the following button

2. If user is not signed in to chat.io, he is asked to sign in:

3. Then, user must allow the app to access some parts of his account:

4. Finally, the app receives `access_token` that lets it perform API calls, limited to what the user agreed on.

## Use cases

With "Sign in with chat.io" flow, you can easily build an app which:

* has access to chat.io user's email or license number,
* will receive `access_token` that can be used to make different API calls.
