# Kabadiwala Connect

> A field-ready digital bridge between informal e-waste collectors, authorized recyclers, and CPCB-oriented reporting workflows.

Kabadiwala Connect is an offline-capable e-waste collection and recycling network designed for the realities of local scrap yards: intermittent connectivity, entry-level devices, changing commodity prices, and a need for clear proof at every handover.

The application combines camera-assisted valuation, benchmark pricing, recycler discovery, pooled pickups, digital receipts, offline capture, and SHA-256 integrity checks in one role-aware workspace.

## Why It Exists

Informal collectors are often closest to discarded electronics but furthest from transparent pricing, formal recycler networks, and durable transaction records. Kabadiwala Connect gives each participant a practical workflow:

- **Collectors** can estimate material value, find recyclers, queue transactions offline, and keep a searchable earnings ledger.
- **Recyclers** can review incoming material, manage compliance-oriented records, and participate in competitive lot acquisition.
- **CPCB administrators** can review benchmark data, field research inputs, and validation reporting surfaces.

This repository contains a working product prototype with seeded demo data. Demo identities, recycler records, prices, field interviews, and authorization values are illustrative and must not be treated as official registrations or verified field evidence.

## Product Highlights

### Role-gated access

Unauthenticated visitors land on a dedicated `/login` route. The dashboard and its data-loading effects do not render before a session exists. The auth surface supports:

- Collector, Recycler, and CPCB Admin role selection
- Phone number plus PIN login and registration flows
- English, Hindi, and Marathi language controls
- Clearly labeled one-click demo access
- Browser-history protection for direct and back-button navigation

The current prototype stores a local browser session. It is a demonstration auth flow, not a production identity provider.

### Offline-first collection

The offline queue in `src/utils/offlineQueue.ts` uses IndexedDB as its primary store and LocalStorage as a fallback. It listens for browser `online` and `offline` events, supports simulated shed mode, and replays queued lots when connectivity returns.

### Transparent valuation

The price guide includes seeded benchmark rates for 17 e-waste categories, seven-day price histories, directional sparklines, material search, and offer auditing. The data is intentionally presented as prototype benchmark data rather than a live market feed.

### Tamper-evident receipts

Receipt payloads are canonicalized before SHA-256 hashing. The client and server share the same field ordering and normalization rules, making changes to weight, rate, identity, or final price visible through hash divergence.

### Persistent local ledger

The Express server initializes `kabadiwala.db` with `better-sqlite3` and creates these tables:

- `materials`
- `recyclers`
- `receipts`
- `field_interviews`
- `ml_validation_log`

## Architecture

```text
Browser / React UI
  |
  |  Vite + TypeScript + Tailwind CSS
  |  IndexedDB offline queue
  |  Web Crypto SHA-256 verification
  v
Express + Vite middleware
  |
  |  REST endpoints
  |  Gemini-backed AI routes (optional)
  v
better-sqlite3
  |
  +-- materials
  +-- recyclers
  +-- receipts
  +-- field_interviews
  +-- ml_validation_log
```

## Technology

- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- Express 4
- Node.js
- `better-sqlite3`
- Google Gemini SDK (`@google/genai`)
- Lucide React
- IndexedDB and Web Crypto APIs

## Project Layout

```text
.
├── server.ts                 # Express server and Vite middleware
├── package.json              # Scripts and dependencies
├── vite.config.ts            # Vite configuration
├── src/
│   ├── App.tsx               # Auth gate, protected shell, and app state
│   ├── index.css             # Global design tokens and dashboard theme
│   ├── types.ts              # Shared domain types
│   ├── components/
│   │   ├── LoginPage.tsx     # Standalone login/register experience
│   │   ├── Header.tsx        # Authenticated navigation shell
│   │   ├── SnapEstimate.tsx  # Camera-assisted valuation workflow
│   │   ├── PriceGuide.tsx    # Benchmark rates and sparklines
│   │   ├── LiveAuction.tsx   # Recycler bidding workflow
│   │   ├── RecyclerPortal.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── EarningsLedger.tsx
│   │   ├── OfflineQueueModal.tsx
│   │   └── ...
│   ├── data/
│   │   ├── authData.ts       # Local demo sessions
│   │   └── mockData.ts       # Seeded prototype data
│   ├── server/
│   │   └── db.ts             # SQLite schema, seeds, and queries
│   └── utils/
│       ├── crypto.ts         # Canonical SHA-256 receipt hashing
│       ├── offlineQueue.ts   # IndexedDB queue and replay engine
│       └── speech.ts         # Voice guide helpers
├── .env.example              # Environment variable template
└── metadata.json             # Project metadata
```

## Run Locally

### Prerequisites

- Node.js 22.5 or newer is recommended for the verified environment.
- npm 10 or newer is recommended.
- A Gemini API key is optional for non-AI flows and required for Gemini-powered routes.

### Install

```bash
npm install
```

Create a local `.env` file from `.env.example` and add your own key:

```env
GEMINI_API_KEY=your_real_key_here
APP_URL=http://localhost:3000
```

Never commit `.env` or real credentials.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

The server initializes the SQLite schema on boot and serves the built React application from port `3000`.

### Windows path note

On Windows, npm's generated `.bin` wrappers can fail when the project lives in a directory whose name contains `&`. This repository was verified from such a path using the direct equivalents below:

```powershell
node .\node_modules\vite\bin\vite.js build
node .\node_modules\esbuild\bin\esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
node .\node_modules\typescript\bin\tsc --noEmit
node .\dist\server.cjs
```

Moving the project to a path without `&` allows the standard npm scripts to run normally.

## Verification Workflows

### SQLite persistence

After the first server boot, inspect the table list with:

```powershell
node -e "const Database=require('better-sqlite3'); const db=new Database('kabadiwala.db'); console.log(db.prepare('SELECT name FROM sqlite_master WHERE type = ? ORDER BY name').all('table')); db.close();"
```

### SHA-256 integrity

Open a receipt from the ledger and use the hash audit action to compare the original payload with a modified payload. A small change such as `25.00 kg` to `25.01 kg` should produce a completely different digest.

### Offline queue

1. Sign in with a demo Collector account.
2. Open Offline Shed mode from the header.
3. Queue a lot while offline or simulated offline.
4. Inspect the IndexedDB-backed pending queue.
5. Re-enable connectivity and replay the queue against the receipt endpoint.

### Typecheck

```bash
npm run lint
```

## API Surface

The server exposes the main prototype data through routes including:

- `GET /api/materials`
- `GET /api/prices`
- `GET /api/recyclers`
- `GET /api/receipts`
- `POST /api/receipts`
- `GET /api/field-interviews`
- `GET /api/ml-validation`

AI-assisted routes require `GEMINI_API_KEY`. When no key is configured, the server reports the missing configuration and non-AI product areas remain available.

## Data and Compliance Notice

This is a product prototype for demonstrating workflows and system design. It is not a CPCB system, an official price index, a legal compliance certification tool, or a source of verified recycler credentials. Seeded identities, licenses, field interviews, prices, and locations are demo records unless independently verified outside this repository.

## License

No license has been declared for this repository yet. Add a license file before distributing the project publicly under specific reuse terms.
