# Cards

A small repo for hosting beautiful one-off invitations — baby showers, birthdays, dinner parties, anything.

Each event lives in its own folder with three files:

```
cards/
├── _template/              ← copy this folder to start a new card
│   ├── invite.html
│   ├── rsvp.html
│   ├── config.js
│   └── cover.png
├── atlas-xzmms2/           ← live event (slug = name + random suffix)
│   └── ... (same four files)
└── README.md               ← you are here
```

URLs follow the pattern:
`https://YOUR_USERNAME.github.io/cards/EVENT_SLUG/invite.html`

**Slugs use a random suffix** so the URL you text isn't easily guessable. The repo itself is public, but a stranger can't predict the URL of a specific card without seeing the repo's file list.

---

## First-time setup (do this once)

This walks you through: pushing the repo to GitHub, enabling Pages, setting up RSVPs for Atlas, and going live. **~15 minutes.**

### 1. Set up the Google Sheet + Apps Script for Atlas's RSVPs

1. Go to [sheets.google.com](https://sheets.google.com), create a new spreadsheet. Name it **"Atlas Shower RSVPs"**.
2. Row 1 headers (exactly): `Timestamp | Event | Name | Email | Attending | Guests | Dietary | Message`
3. **Extensions → Apps Script**. Replace any code in `Code.gs` with the script from the [RSVP setup section below](#rsvp-setup-per-card), then save.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** ← required
5. Approve permissions (Advanced → Go to project unsafe — it's your own code).
6. **Copy the Web App URL.** Format: `https://script.google.com/macros/s/AKfycby.../exec`

### 2. Plug the URL into Atlas's config

Open `atlas-xzmms2/config.js` and find:

```js
appsScriptUrl: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
```

Replace the placeholder with your URL. Save.

### 3. Push to GitHub

```bash
# From inside the cards/ folder
git init
git add .
git commit -m "Initial cards setup"
git branch -M main

# Create the repo on GitHub (must be public for free Pages)
gh repo create cards --public --source=. --push

# Without gh CLI: create the repo at github.com/new (public, no README), then:
#   git remote add origin https://github.com/YOUR_USERNAME/cards.git
#   git push -u origin main
```

### 4. Enable GitHub Pages

```bash
gh api repos/:owner/cards/pages \
  -X POST \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

Or in the browser: **repo Settings → Pages → Source: Deploy from branch → main → / (root) → Save**.

First activation takes ~1–2 minutes. After that, every push deploys in ~30 seconds.

### 5. Test it

Open `https://YOUR_USERNAME.github.io/cards/atlas-xzmms2/invite.html` on your phone. Tap envelope → submit RSVP → check your Sheet (should appear in 2 seconds) and your email at evan@yedi.app (notification).

### 6. Text it out

Paste the invite URL into Messages. iMessage auto-fetches the cover image as a link preview.

> James and Sean are throwing a baby shower for me, Selina, and the soon-to-arrive Atlas. June 8th in DC — would love to have you there 🐳
>
> [link]

**Pro tip:** text yourself first to confirm the link preview shows the cover image before sending to your guest list.

---

## Adding a new card

```bash
cd cards

# Generate an unguessable slug (6-char random suffix)
SUFFIX=$(LC_ALL=C tr -dc 'abcdefghijkmnpqrstuvwxyz23456789' </dev/urandom | head -c 6)
SLUG="my-event-${SUFFIX}"   # e.g. my-event-x7k2m9
echo "Your slug: $SLUG"

cp -r _template "$SLUG"
cd "$SLUG"
# 1. Replace cover.png with your image
# 2. Edit config.js (every event-specific value lives there)
# 3. (Optional) Set up a Google Sheet + Apps Script for RSVPs;
#    paste the Web App URL into config.js's appsScriptUrl field
cd ..
git add "$SLUG"
git commit -m "Add ${SLUG} card"
git push
```

Live in ~30 seconds at `https://YOUR_USERNAME.github.io/cards/$SLUG/invite.html`.

**Pick the prefix freely** — `sarahs-30th`, `dinner-jun15`, `holiday-2026` — but always keep the random suffix so the URL is unguessable.

---

## What lives where

**`config.js`** — all event-specific values. Names, dates, location, copy, theme colors, registry/map links, RSVP destination. **You only edit this file** for a new card.

**`cover.png`** — the envelope cover image. Becomes the iMessage link preview when you text the URL. Aspect ratio ~1060×1500 (vertical).

**`invite.html`** — the invitation page. Reads from `config.js`. Don't edit unless you want to change the design itself.

**`rsvp.html`** — the RSVP form. Also reads from `config.js`. Don't edit.

---

## RSVP setup (per card)

Each card can have its own Google Sheet, or you can share one Sheet across cards (the RSVP page sends an `event` field that identifies which card it came from — handy for sorting).

### Per-card Sheet (cleanest)

1. Create a new Google Sheet.
2. Row 1 headers: `Timestamp | Event | Name | Email | Attending | Guests | Dietary | Message`
3. **Extensions → Apps Script**, paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(data.timestamp || new Date()),
      data.event || '',
      data.name || '',
      data.email || '',
      data.attending || '',
      data.guests || '',
      data.dietary || '',
      data.message || ''
    ]);

    // Optional: notify yourself
    MailApp.sendEmail(
      'evan@yedi.app',
      `RSVP [${data.event}]: ${data.name} — ${data.attending}`,
      [`Event: ${data.event}`,`Name: ${data.name}`,`Email: ${data.email}`,
       `Attending: ${data.attending}`,`Guests: ${data.guests}`,
       `Dietary: ${data.dietary}`,`Message: ${data.message}`].join('\n')
    );

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) { return ContentService.createTextOutput('RSVP endpoint live.'); }
```

4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ← required
5. Approve permissions (Advanced → Go to project unsafe — it's your own code).
6. Copy the Web App URL → paste into `config.js` as `appsScriptUrl`.

### Shared Sheet (one Apps Script for all cards)

Same setup, but reuse the same Web App URL across all your `config.js` files. The `Event` column tells you which card the RSVP came from.

---

## Theming (optional)

`config.js` has a `theme` block with CSS color variables. Change them for a different look without touching the design code:

```js
theme: {
  ink:        "#2a1e3f",   // main text color
  inkSoft:    "#4a3c5c",
  gold:       "#d4a373",   // accent
  cream:      "#f0e6d6",
  creamWarm:  "#faf3e0",   // card background
  bgGradient: "radial-gradient(ellipse at center, #2a1e3f 0%, #1a0e2f 100%)",
  showStars:  false,       // turn off the starfield
}
```

---

## Privacy notes

The repo is public (required for free GitHub Pages), but each card's folder uses an unguessable random suffix (e.g. `atlas-xzmms2`). The URL you text guests can't be predicted without seeing the repo's file listing on github.com.

A determined person could still browse to `github.com/YOUR_USERNAME/cards` and see every event you've ever made. For most events that's fine. If you want stronger privacy, options:
- Make this a **private repo** with GitHub Pro ($4/mo) — Pages still works, but the file list is hidden from the public.
- Or use a service like Netlify/Vercel where the source isn't browsable at all.

---

## Updating a live card

Edit `config.js` (or replace `cover.png`), then:

```bash
git add .
git commit -m "Update [event] details"
git push
```

Live in ~30 seconds. iMessage caches link previews — append `?v=2` to the URL when re-sharing if the cover image changed.

---

## Removing a card after the event

```bash
git rm -r my-event-name
git commit -m "Archive my-event-name"
git push
```
