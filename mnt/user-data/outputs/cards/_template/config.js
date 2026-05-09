// =====================================================================
//  CARD CONFIG
//  ---------------------------------------------------------------------
//  Edit this file to customize the invitation for a new event.
//  Everything event-specific lives here — names, dates, copy, links.
//  The HTML files (invite.html, rsvp.html) read from this and never
//  need to be edited.
// =====================================================================

window.CARD_CONFIG = {

  // ─── Page metadata (shows in browser tab + iMessage link previews) ────
  meta: {
    title: "You're Invited",                          // browser tab title
    description: "Tap to open your invitation.",      // shown under link previews
    coverImage: "cover.png",                          // image filename in this folder
  },

  // ─── Cover hint (the pulsing button on the envelope) ──────────────────
  coverHint: "Tap to Open",

  // ─── Card content ─────────────────────────────────────────────────────
  // Each line below maps directly to a piece of the card.
  // Set any field to "" or null to hide it.
  card: {
    eyebrow:   "You Are Invited",          // small text above hosts
    hosts:     "James & Sean",             // who's hosting (use & freely)
    intro:     "request the pleasure of your company<br>at a baby shower celebrating",
    honorees:  "Evan & Selina",            // guests of honor
    subhead:   "And the impending arrival of",  // small line above the big name
    feature:   "Atlas",                    // BIG word — main name/event title

    tagline:   "The adventure starts in July.<br>The party starts June 8<sup>th</sup>.",

    details: [
      { label: "When",        value: "Sunday, June 8<sup>th</sup>, 2026", sub: "5:30 in the evening" },
      { label: "Where",       value: "329 11<sup>th</sup> Street NE<br>Washington, DC 20002",
                              link:  "https://maps.app.goo.gl/Nj1S126tVme6LA396" },
      { label: "Provisions",  value: "<em>Dinner provided</em>" },
      { label: "For the Captain's Quarters", value: "Babylist Registry",
                              link:  "https://my.babylist.com/baby-reg-selina-wang" },
    ],

    // Buttons under the details
    buttons: [
      { label: "RSVP",          href: "rsvp.html",   primary: true  },
      { label: "Get Directions", href: "https://maps.app.goo.gl/Nj1S126tVme6LA396", primary: false, external: true },
    ],

    signoff: "with love, James & Sean",   // handwritten line at bottom
  },

  // ─── RSVP page ────────────────────────────────────────────────────────
  rsvp: {
    eyebrow:    "Kindly Reply",
    headline:   "For Atlas",
    subhead:    "June 8<sup>th</sup> · Washington, DC",

    // Where RSVPs go. Paste your Google Apps Script Web App URL here.
    appsScriptUrl: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",

    // Confirmation messages after submission
    confirmYes: {
      headline: "See You Soon",
      message:  "Your reply has been recorded. We can't wait to celebrate Atlas with you on June 8<sup>th</sup>.",
    },
    confirmNo: {
      headline: "Thank You",
      message:  "We'll miss you — but thank you for letting us know. Atlas already has a wonderful village.",
    },
    signoff: "— James & Sean",
  },

  // ─── Theme (optional — keep defaults for the ocean/Atlas look) ───────
  // To make a different visual theme, change these CSS color values.
  theme: {
    ink:         "#1a3a6b",   // deep blue text
    inkSoft:     "#2d4a7a",   // softer blue for secondary text
    gold:        "#c9a961",   // accent gold
    cream:       "#f5ecd6",
    creamWarm:   "#faf3e0",   // card background
    bgGradient:  "radial-gradient(ellipse at center, #1e3a6f 0%, #0d2a52 50%, #061a35 100%)",
    showStars:   true,        // animated starfield behind the card
  },

};
