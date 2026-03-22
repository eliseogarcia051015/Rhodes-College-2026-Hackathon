# LinguaMap — Shelby County Language Accessibility Map

An interactive map of Shelby County, TN that visualizes where non-English speaking communities live and highlights local services that support their language needs.

---

## The Problem

Memphis is one of the most diverse cities in the South, yet many residents who speak little or no English struggle to find services that can communicate with them — whether that's a hospital, a legal aid office, or a library. There is no easy way to see where these communities are concentrated or which nearby services are accessible to them.

## What LinguaMap Does

- Displays a map of Shelby County color-coded by language spoken at home
- Lets users filter by language (Spanish, Indo-European, Asian/Pacific, and Other Languages, sections based off of US Census language groupings) 
- Shows markers for local services that support each language
- Clicking a neighborhood shows a breakdown of languages spoken there and nearby accessible services

## Live Demo

[https://rhodes-college-2026-hackathon.vercel.app](https://rhodes-college-2026-hackathon.vercel.app)

## How to Run Locally

No setup required. Just clone the repo and start a local server:
```bash
git clone https://github.com/eliseogarcia051015/Rhodes-College-2026-Hackathon.git
cd Rhodes-College-2026-Hackathon
python3 -m http.server 8000
```

Then open your browser and go to `http://localhost:8000`

## Tech Stack

- [Leaflet.js](https://leafletjs.com/) — interactive map rendering
- OpenStreetMap — map tiles
- US Census ACS 2022 API — language population data by census tract
- Plain HTML, CSS, JavaScript — no frameworks or build steps
- Vercel — deployment

## Team

- **Saul Bolanos**
- **Eliseo (Jorge) Garcia**

Rhodes College — 2026 Hackathon

## AI Use Disclosure

In accordance with the hackathon's AI transparency policy, we used AI (Claude by Anthropic) for:
- **Brainstorming** the project idea and feature set
- **Debugging** layout and map rendering issues
- **Designing** the UI structure and color scheme
- **Programming** assistance with Leaflet.js setup, CSS layout, and Census API integration

All final decisions, edits, and implementation were made by the team.