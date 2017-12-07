---
weight: 20
---

# Setup

This tutorial explains how to create a "Sign in with chat.io" button and place it on a website.

## 1. Create a new app
Create a new app in the <a href="https://console.chat.io/">Developers Console</a>. The app type must be <strong>Web app (frontend)</strong>. 
You will receive a new `client_id` that you will need in the next steps.

<div class="callout type-warning">Please note that <strong>Redirect URI</strong> field in the Console must match the URL of the website where you want to place the "Sign in with chat.io" button. The button will <strong>not</strong> work with any other URL addresses.
</div>

## 2. Include the SDK library

Create a simple HTML page and include the following JavaScript library:

```html
<script src="//cdn.chatio-static.com/accounts/accounts-sdk.min.js"></script>
```

## 3. Prepare the button container

Create the space for your "Sign in with chat.io" button. You can use the native button or create a custom one, as described below. 

#### Native "Sign in with chat.io" button

Use the following HTML code to prepare the container for your "Sign in with chat.io" button. The button will be automatically inserted into the container.

```html
<div class="chatio-login-button"></div>
```
<div class="callout type-warning">Don't remove the <code>chatio-login-button</code> class from the container, or the button won't work properly.</div>

#### Custom "Sign in with chat.io" button

If you prefer to design your own button, you can do that, too. Just bind the [`openPopup()`](#instance-openpopup) method of `AccountsSDK` instance to the `onclick` attribute for your link or button.

```js
// javascript
var instance = AccountsSDK.init({ ... });
```
```html
<!-- html -->
<a href="" onclick="instance.openPopup()">Sign in with chat.io</a>
```

## 4. Initialize the SDK

Insert the following JavaScript code before the closing `</body>` tag.

```html
<script>
var instance = AccountsSDK.init({
  client_id: '<your_client_id>',
  onIdentityFetched: (error, data) => {
    if (data) {
      console.log('User authorized!');
      console.log('License number: ' + data.license);
    }
  }
});
</script>
```

That's it!

Your users will see the "Sign in with chat.io" button if they are not logged in to chat.io.

If they are already logged in, you will immediately receive their user data, such as their `access_token` or `license` number.
