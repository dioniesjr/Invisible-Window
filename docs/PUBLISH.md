# Publish Invisible Window to the Chrome Web Store

You submit from your Google account. This repo has the package, assets, and copy ready.

## Before you start

1. Pay the one-time [Chrome Web Store developer registration](https://chrome.google.com/webstore/devconsole) fee if you have not already (~USD $5).
2. Host the privacy page (or use GitHub Pages below).
3. Prefer a real screenshot of the installed popup in addition to `store/screenshot-1-1280x800.png`.

## Review risk (read this)

Extensions that spoof focus/visibility are similar to published “Always Active” tools and can be accepted when framed as productivity.

Extensions that specifically defeat quiz / exam leave detection are more likely to be rejected or removed under Chrome Web Store policies on deceptive or circumvention behavior. If review fails, disable or remove the Canvas shield, resubmit with keep-tab-active only, and keep the listing copy focused on “keep tabs active.”

## 1. Enable the privacy policy URL

Privacy file in this repo: `docs/privacy.html`

### GitHub Pages (recommended)

1. Open https://github.com/dioniesjr/Invisible-Window/settings/pages
2. Source: **Deploy from a branch**
3. Branch: `main` / folder: `/docs`
4. Save, wait 1–2 minutes
5. Policy URL should be:
   `https://dioniesjr.github.io/Invisible-Window/privacy.html`
6. Confirm it opens in an Incognito window

## 2. Upload the extension package

1. Open https://chrome.google.com/webstore/devconsole
2. **New item**
3. Upload `dist/invisible-window-1.0.0.zip`
4. Confirm the package unpacks with `manifest.json` at the root

## 3. Store listing

Copy/paste from `store/LISTING.md`:

- Name, short description, detailed description
- Category: Productivity
- Language: English
- Homepage + support URLs
- Privacy policy URL
- Upload `store/store-icon-128.png`, `store/promo-small-440x280.png`, `store/screenshot-1-1280x800.png`

## 4. Privacy practices tab

- Single purpose: keep tabs looking active when the user switches away
- Declare data collection accurately (local preferences only; no remote collection)
- Affirm limited use / no selling data
- No remote code

## 5. Distribution and submit

- Visibility: Public (or Unlisted for a private link first)
- Submit for review

Typical first review: a few hours to several days.

## After approval

When you ship updates:

1. Bump `version` in `manifest.json`
2. Rebuild the zip under `dist/`
3. Upload a new package in the dashboard
4. Submit again
