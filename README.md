# Invisible Window

Chrome extension that keeps tabs looking focused when you switch away.

[Publish to Chrome Web Store](docs/PUBLISH.md) · [Privacy Policy](docs/privacy.html) · [Store listing copy](store/LISTING.md)

## Install (local / unpacked)

1. Download or clone this repo.
2. Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → this folder.
3. Hard-refresh open tabs.

## Features

- Spoof `document.hidden` / `visibilityState` / `hasFocus()`
- Block common leave events on `window` / `document`
- Optional Canvas quiz leave-tracking shield (`page_blurred` / `page_focused` only)
- Popup toggles for both layers

No autofill. No ChatGPT. No remote account.

## Package for Web Store

`dist/invisible-window-1.0.0.zip` is the upload package (manifest at ZIP root).

## Attribution

Keep-tab-active techniques adapted from [Always Active Window](https://github.com/brian-girko/always-active) (MPL-2.0). See `NOTICE`.
