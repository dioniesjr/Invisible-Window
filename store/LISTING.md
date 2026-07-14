# Chrome Web Store listing copy

Use these fields in the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Product details

| Field | Value |
|-------|--------|
| Name | Invisible Window |
| Language | English |
| Category | Productivity |
| Homepage | https://github.com/dioniesjr/Invisible-Window |
| Support | https://github.com/dioniesjr/Invisible-Window/issues |
| Privacy policy | https://dioniesjr.github.io/Invisible-Window/privacy.html |

## Short description (max 132 characters)

```
Keep browser tabs looking focused when you switch away, so pages do not treat the tab as idle.
```

(Count: 97 characters)

## Detailed description

```
Invisible Window keeps the current tab looking active when you alt-tab or switch tabs.

Many sites pause, warn, or change behavior when document.hidden flips or focus is lost. This extension spoofs those page APIs so the tab continues to look visible and focused.

Features
• Keep tabs active on http and https pages
• Spoof document.hidden, visibilityState, and hasFocus()
• Block common leave events (visibilitychange, blur, and related page-root events)
• Optional Canvas quiz leave-tracking shield (blocks page_blurred / page_focused event posts; does not block normal answer autosave)
• Simple on/off toggles in the popup

How to use
1. Install the extension
2. Open the popup and leave Keep tabs active on
3. Hard-refresh open pages once
4. Switch away and back: the page should still report as visible/focused

Limits
• Your operating system still moves real focus when you alt-tab
• Desktop monitoring software outside the browser is not covered
• Some sites may still use other signals

Privacy
Preferences are stored with chrome.storage only. Invisible Window does not send browsing content to a server.
```

## Permission justifications

### storage
Stores the user’s Keep tabs active and Canvas shield on/off preferences with chrome.storage.sync. No page content is stored.

### Host permission / content scripts on http(s)://*/*
Required to inject the keep-active script on pages the user visits so those pages can continue reporting as focused/visible when the user switches away.

### Canvas quiz URL matches
Optional shield that blocks leave-tracking requests (`page_blurred` / `page_focused`) on Canvas quiz pages only. Normal quiz answer autosave is not blocked.

## Privacy practices (dashboard)

- Single purpose: Keep browser tabs looking active when the user switches away from them.
- Does this extension collect user data? **No** (only local preference toggles via chrome.storage; not Personal Communications / Web History uploads).
- If asked about data use / limited use: certify no selling, no ads targeting, no transfer to brokers.
- Remote code: **No**
- Privacy policy URL: required because of `storage` and broad content-script host access.

## Store images (upload in dashboard)

From the `store/` folder in this repo:

| Asset | File | Size |
|-------|------|------|
| Store icon | `store-icon-128.png` (also upload `store-icon-512.png` if offered) | 128 / 512 |
| Small promo tile | `promo-small-440x280.png` | 440×280 |
| Screenshot 1 | `screenshot-1-1280x800.png` | 1280×800 |

Tip: also capture one real Chrome screenshot of your live popup for review accuracy.

## Upload package

Use `dist/invisible-window-1.0.0.zip` (manifest.json at ZIP root).
