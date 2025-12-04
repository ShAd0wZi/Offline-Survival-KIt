🛡️ Offline Survival Kit (PWA)
==============================

> **"Because Google won't save you when the grid goes down."**

⚡ The Lowdown
-------------

This is a **Progressive Web App (PWA)** designed for real-world emergencies. It's built to work cleanly on your phone or laptop with **zero internet connection** once installed.

We aren't just caching static pages here; we're using **IndexedDB (via Dexie.js)** to store survival guides, tools, and settings locally. If the power cuts out and the cell towers die, this app still runs.

🎯 Features
-------------------

### Core Tech

-   ✅ **True Offline-First:** Uses Service Workers (Workbox) and local DB storage.

-   ✅ **PWA Ready:** Installable on iOS, Android, and Desktop.

-   ✅ **Privacy:** Zero tracking. Zero external API calls after download.

### Survival Modules

-   **6 Pre-loaded Guides:** First Aid, Fire, Earthquake, Flood, Water Purification, and Shelter.

-   **Smart Search:** Filter guides instantly.

-   **Guide Details:** Step-by-step instructions with critical warnings.

-   **Settings Manager:** One-click "Download All" to sync assets for offline use.

🛠️ Tech Stack
--------------

-   **Core:** React 18 + TypeScript

-   **Build:** Vite

-   **PWA:** vite-plugin-pwa + Workbox

-   **Database:** Dexie.js (IndexedDB wrapper)

-   **UI/UX:** TailwindCSS + shadcn/ui + Lucide Icons

-   **State:** TanStack Query

* * * * *

🚀 Getting Started
------------------

You need **Node.js (v16+)** installed.

### 1\. Clone & Install

Bash

```
git clone https://github.com/ShAd0wZi/Offline-Survival-Kit.git
cd Offline-Survival-Kit
npm install

```

### 2\. Run Locally

Bash

```
npm run dev
# App will launch at http://localhost:8080 (or similar port)

```

### 3\. Build for Production

Bash

```
npm run build
npm run preview

```

* * * * *

📱 How to Test Offline Mode
---------------------------

You can't just unplug your router to test dev mode. Here is how to actually verify it works:

**Method 1: Chrome DevTools (The Dev Way)**

1.  Press `F12` to open DevTools.

2.  Go to the **Application** tab → **Service Workers**.

3.  Check the **"Offline"** box.

4.  Navigate the app. If it crashes, we failed. If it loads, we win.

**Method 2: The Real Test**

1.  Run `npm run build` and `npm run preview`.

2.  Open in browser and click the install icon (in the Omnibar).

3.  Turn off your Wi-Fi / disconnect Ethernet.

4.  Open the installed app.

* * * * *

🏗️ Project Structure
---------------------

Plaintext

```
src/
├── components/      # UI building blocks (shadcn/ui)
├── db/              # Dexie.js schema & seed data
├── hooks/           # Custom hooks (useOfflineStatus)
├── pages/           # Main route views (Home, Guides, Tools)
├── services/        # Offline logic
└── App.tsx          # Main entry

```

📝 For Developers
-----------------

### Adding New Guides

Want to add a guide on "How to hotwire a car"? Go to `src/db/seedData.ts`. Follow the schema:

TypeScript

```
{
  id: 'hotwire-101',
  title: 'Urban Mechanics',
  priority: 'critical',
  steps: [ ... ]
}

```

### Troubleshooting

-   **App not installing?** PWA features require HTTPS or `localhost`.

-   **Data missing?** Check `Application > IndexedDB` in DevTools. If it's empty, hit the "Download Offline Content" button in Settings.

🚧 Roadmap (Phase 2 & 3)
------------------------

-   [ ] **AI Assistant:** Local-only LLM for emergency Q&A.

-   [ ] **Tools:** Flashlight, SOS signaler, Unit converters.

-   [ ] **Maps:** Offline vector maps (Leaflet/OpenLayers).

📄 License
----------

MIT. Build it, fork it, survive with it.

* * * * *

*Built with panic-induced adrenaline by [ShAd0wZi](https://www.google.com/search?q=https://github.com/ShAd0wZi).*
