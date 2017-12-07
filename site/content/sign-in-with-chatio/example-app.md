---
weight: 40
---

# Sample app

This sample app will display chat.io user's license number when the user clicks the "Sign in with chat.io" button.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body>

<h1>Hello, world!</h1>
<div class="chatio-login-button"></div>
<div id="license"></div>

<script src="//cdn.chatio-static.com/accounts/accounts-sdk.min.js"></script>
<script>
AccountsSDK.init({
  client_id: '<your_client_id>',
  onIdentityFetched: function(error, data) {
    if (data) {
      document.getElementById('license').innerText = data.license;
    }
  }
});
</script>
</body>
</html>
```

