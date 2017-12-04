# Changelog

## [v0.4 developer preview]

### Added
- New method `multicast`

### Changed
- Push message `incoming_broadcast` changed to `incoming_multicast`
- `last_event_per_type` object is now map of objects with specific type of event, `thread_order` and `thread_id`
- `last_event_per_type` object contains last events from chat instead of thread

### Removed
- Method `send_broadcast`, use `multicast` instead

### Fixed
- Support for `file` event in `last_event_per_type` for non-active chats
- Include different types of events in `last_event_per_type` for non-active chats

## [v0.3] - 2017-11-09

### Added
- Support for uploading images
- Support for sending messages as bots with `author_id`
- `creation_date` to `license` object in `login` response

### Changed
- Replace `properties` with `fields` in `customer` object
- Every validation error has user-friendly message with details

### Removed
- Method `send_message`, use `send_event` instead
- Method `supervise_chat` as well as `supervisor`/`supervisors` objects

### Fixed
 - `author_id` in `custom` event

## [v0.2] - 2017-09-01

### Added
- `monitoring` to `customer` object in `get_archives` response
- Support for chat scopes
- Support for managing auto chat scopes configuration
- Support for sending broadcast to agents
- New chat event type - `custom`

### Changed
- Move `license_id` and `plan` to `license` object in `login` response

### Removed
- Active chats from `login` response
- `firebase_token` param from `login` request

## [v0.1] - 2017-04-24

:sparkles:
