---
title: "Protocol"
weight: 10
---

# Protocol

## Actions initialized by client

Due to asynchronous nature of websocket protocol, all request must include `id` parameter that specifies the request id. All API responses will include this id to let the client match the response to appropriate request. Response will also contain `action` (same as request's action, see below) and `type` defined as `response`.

All API requests must also include `action` parameter that specifies which action to perform. It's an equivalent of a URL and HTTP request method used in RESTful APIs.

Any additional data in the request must be included inside the `payload` parameter.

**Request**  
```js
{
  "id": "1473745636515", // request id
  "action": "send_message", // request action
  "payload": {
    "chat": {
      "id": "123"
    },
    "message": {
      "text": "hello world"
    }
  }
}
```

**Response**  
```js
{
  "id": "1473745636515",
  "action": "send_message",
  "type": "response",
  "success": true,
  "payload": { // optional
  }
}
```

## Actions initialized by server

All server messages will include `action` parameter that specifies which action to perform. Also, `type` is defined as `push`. Any additional data in the response will be included inside the `payload` parameter.


**Push**  
```js
{
  "action": "incoming_chat",
  "type": "push",
  "payload": { // optional
  }
}
```

