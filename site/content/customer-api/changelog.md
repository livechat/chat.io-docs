# Changelog

## [v0.4 developers preview]

### Changed
- `last_event_per_type` object is now map of objects with specific type of event, `thread_order` and `thread_id`
- `last_event_per_type` object contains last events from chat instead of thread

### Fixed
- Support for `file` event in `last_event_per_type` for non-active chats

## [v0.3] - 2017-11-09

### Added
- New message `get_chats_summary`
- New reasons in `customer_disconnected` push
- Short guide for RTM API and Web API to docs
- Total events to `threads_summary` object

### Changed
- Require customer to authorize with `token` param instead of cookies in `login` request
- Expect `offset` and `limit` params instead of `pagination` object in `get_chat_threads_summary` request
- Always use `offset` for pagination instead of `page`
- Return `total` results rather than `pagination` object
- Replace `properties` with `fields` in `customer` object
- Update error handling
- Every validation error has user-friendly message with details

### Removed
- `last_chats_limit` and `last_threads_limit` params from `login` request
- Customer's chats in `login` response

### Fixed
 - `author_id` in `custom` event

## [v0.2] - 2017-09-01

### Added
- Support for chat scopes
- New chat event type - `custom`

### Changed
- Pushes with empty list of updated properties will no longer be sent

### Removed
- Method `send_message` in RTM API

## [v0.1] - 2017-04-24

:sparkles: