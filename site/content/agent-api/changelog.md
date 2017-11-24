# Changelog

## [v0.3 dev preview]

### Added
- Support for uploading images
- Support for sending messages as bots with `author_id`
- `creation_date` to `license` object in `login` response

### Changed
- Replace `properties` with `fields` in `customer` object
- Every validation error has user-friendly message with details

### Removed
- Method `send_message`, use `send_event` instead
- Method `supervise_chat` as well as `supervisor` object

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
