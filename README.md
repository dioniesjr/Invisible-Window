# Invisible Window

Chrome extension that only hides tab leave / alt-tab signals from web pages.

No autofill. No ChatGPT. No QuizFetch database.

## What it does

### 1. Keep tabs active (all http/https pages)

Injected at `document_start` in every frame:

| Layer | Role |
|-------|------|
| `keep-tab-active-bridge.js` (isolated) | Reads real `document.hidden` and syncs on/off from storage |
| `keep-tab-active.js` (page/MAIN world) | Spoofs visibility/focus APIs and blocks leave events |

When enabled:

- `document.hidden` stays `false`
- `document.visibilityState` stays `"visible"`
- `document.hasFocus()` returns `true`
- Capture-phase blocks: `visibilitychange`, `blur`, `focus`, `focusin`, `focusout`, `pagehide`, `mouseleave`, related events on `window` / `document`
- Page scripts cannot register those listeners on page root targets
- `requestAnimationFrame` keeps ticking while the tab is actually backgrounded

Techniques adapted from [Always Active Window](https://github.com/brian-girko/always-active) (MPL-2.0).

### 2. Canvas leave tracking shield (quiz URLs only)

`canvas-quiz-shield.js` blocks `sendBeacon` / `fetch` / `XHR` to:

`/submissions/:id/events`

when the body is leave tracking (`page_blurred` / `page_focused`).

Normal answer autosave is not blocked.

## Limits

- OS alt-tab still moves real OS/browser focus.
- Desktop proctoring software and server-side logs outside these APIs are not covered.
- Timer-based quiz autosave while you are still on the quiz tab still runs.

## Install

1. Clone this repo.
2. Chrome → `chrome://extensions` → Developer mode → Load unpacked → select this folder.
3. Hard-refresh pages you care about.

## Verify

Console on any page:

```javascript
document.hidden;                                  // false
document.visibilityState;                         // "visible"
document.hasFocus();                              // true
window.__invisibleWindowKeepTabActivePatched;     // true
```

On a Canvas quiz take page:

```javascript
window.__invisibleWindowCanvasQuizShield;         // true
```

Network: alt-tab away and back. You should not see new POSTs to `.../submissions/.../events` with `page_blurred` / `page_focused`.

Local probe:

```bash
cd scripts
python -m http.server 8080
# open http://127.0.0.1:8080/tab-visibility-probe.html
```

Also useful: [webbrowsertools.com/test-always-active](https://webbrowsertools.com/test-always-active)

## Popup

- **Keep tabs active** — global visibility/focus anti-detection
- **Block Canvas leave tracking** — quiz events shield

Hard-refresh after toggling.
