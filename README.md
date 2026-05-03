# 🚛 AI Supply Chain Disruption Predictor

> A real-time, AI-powered logistics dashboard for supply chain resilience — featuring live route monitoring, disruption simulation, ETA prediction, bottleneck detection, and an intelligent Logistics Copilot.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [WebSocket Events](#websocket-events)
- [Frontend Features](#frontend-features)
- [Backend Services](#backend-services)
- [Graph & Routing Algorithm](#graph--routing-algorithm)
- [AI Layer](#ai-layer)
- [Known Limitations & TODOs](#known-limitations--todos)
- [Contributing](#contributing)

---

## Overview

The **AI Supply Chain Disruption Predictor** is a full-stack web application that simulates and monitors a logistics network in real time. It predicts disruptions, calculates optimal routes using A\* pathfinding, scores risk levels, estimates delivery ETAs, and provides an AI Copilot chat interface for on-demand supply chain advice.

The system automatically injects simulated disruptions (traffic delays, road closures, weather penalties) every 12 seconds over WebSockets and recomputes optimal routes live — giving users a real-time view of how their supply chain responds to dynamic conditions.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ **Live Route Monitor** | Real-time route visualization with Socket.IO, showing optimal paths as disruptions occur |
| ⚠️ **Disruption Risk Scoring** | Weighted scoring engine factoring route, weather, traffic, and time-of-day |
| 🚦 **Bottleneck Detection** | Congestion analysis across network corridors with severity scoring |
| ⏱️ **ETA Prediction** | Delivery time estimates with traffic/weather delay breakdowns and confidence scores |
| 🔁 **Alternate Route Finder** | A\* pathfinding with live traffic multipliers and route preference modes |
| 🤖 **Logistics Copilot** | AI chat interface for rerouting advice, risk inquiries, and supply chain Q&A |
| 📊 **Dashboard Metrics** | Live KPI cards and recent shipments table |
| ⚡ **Real-time Simulation** | Auto-firing disruption engine that mutates graph weights and recomputes routes every 12

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.5 | UI framework |
| TypeScript | ~6.0.2 | Type safety |
| Vite | ^8.0.10 | Build tool & dev server |
| Tailwind CSS | ^4.2.4 | Styling |
| Socket.IO Client | ^4.8.3 | Real-time WebSocket connection |
| Axios | ^1.15.2 | HTTP API client |
| Zustand | ^5.0.12 | State management |
| Lucide React | ^1.11.0 | Icon library |
| React Router DOM | ^7.14.2 | Routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | ^5.2.1 | HTTP server & REST API |
| TypeScript | ^6.0.3 | Type safety |
| Socket.IO | ^4.8.3 | Real-time WebSocket server |
| dotenv | ^17.4.2 | Environment variable management |
| nodemon | ^3.1.14 | Dev auto-restart |

---

## Project Structure

```
Help-Logistics/
└── ai-supply-chain-predictor/
    ├── README.md
    ├── frontend/                        # React + Vite application
    │   ├── index.html
    │   ├── vite.config.ts
    │   ├── tailwind.config.js
    │   ├── tsconfig.json
    │   ├── public/
    │   │   ├── favicon.svg
    │   │   └── icons.svg
    │   └── src/
    │       ├── main.tsx                 # App entry point
    │       ├── App.tsx                  # Root component → renders Dashboard
    │       ├── index.css
    │       ├── App.css
    │       ├── api/
    │       │   └── index.ts             # Axios API client (all endpoints)
    │       ├── store/
    │       │   └── useStore.ts          # Zustand global state
    │       ├── pages/
    │       │   └── Dashboard.tsx        # Main dashboard page layout
    │       ├── components/
    │       │   └── layout/
    │       │       ├── Sidebar.tsx      # Left navigation sidebar
    │       │       └── Header.tsx       # Top header bar
    │       └── features/
    │           ├── dashboard/
    │           │   ├── TopMetrics.tsx        # KPI cards row
    │           │   └── RecentShipments.tsx   # Shipments data table
    │           ├── live-routing/
    │           │   ├── LiveRouteDashboard.tsx # Main map + controls panel
    │           │   ├── RouteVisualizer.tsx    # SVG route graph renderer
    │           │   ├── useLiveRoute.ts        # Socket.IO hook
    │           │   └── routeSocketClient.ts   # Socket client setup
    │           ├── disruption-risk/
    │           │   └── RiskPanel.tsx          # Risk score display
    │           ├── bottleneck-detection/
    │           │   └── CongestionPanel.tsx    # Congestion metrics panel
    │           ├── eta-prediction/
    │           │   └── EtaPanel.tsx           # ETA breakdown panel
    │           ├── alternate-routing/
    │           │   └── RoutingPanel.tsx       # Alternate route panel
    │           └── logistics-copilot/
    │               ├── CopilotPanel.tsx       # AI chat interface
    │               └── widgets/
    │                   ├── RouteRecommendationWidget.tsx
    │                   └── RiskAssessmentWidget.tsx
    │
    ├── backend/                         # Express + TypeScript API
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── src/
    │   │   ├── index.ts                 # Server entry — Express + Socket.IO init
    │   │   ├── routes/
    │   │   │   └── api.ts               # All REST route definitions
    │   │   ├── controllers/
    │   │   │   └── apiController.ts     # Route handler functions
    │   │   ├── services/
    │   │   │   ├── routingEngine.ts     # A* routing with traffic modifiers
    │   │   │   ├── riskEngine.ts        # Risk score calculator
    │   │   │   ├── etaEngine.ts         # ETA prediction engine
    │   │   │   ├── congestionEngine.ts  # Bottleneck detection
    │   │   │   ├── copilotEngine.ts     # Copilot query handler
    │   │   │   ├── disruptionEngine.ts  # 12s interval disruption simulator
    │   │   │   ├── graphWeightUpdater.ts# Live edge weight mutation
    │   │   │   ├── routeRecomputeEngine.ts # Triggers re-pathfinding
    │   │   │   ├── trafficFeedService.ts # Traffic penalty injector
    │   │   │   ├── weatherFeedService.ts # Weather penalty injector
    │   │   │   ├── explanationEngine.ts  # Route explanation generator
    │   │   │   └── eventBus.ts          # Node.js EventEmitter pub/sub
    │   │   ├── ai/
    │   │   │   └── geminiClient.ts      # Mock Gemini AI client
    │   │   ├── algorithms/
    │   │   │   ├── graph.ts             # Graph data structure + mock network
    │   │   │   └── astar.ts             # A* pathfinding implementation
    │   │   └── sockets/
    │   │       └── routeUpdates.ts      # Socket.IO server + event handlers
    │   └── dist/                        # Compiled JavaScript output
    │
    └── docs/
        └── api-spec.md                  # API endpoint documentation
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│                                                             │
│  Dashboard ──► LiveRouteDashboard ──► RouteVisualizer       │
│             ├─► CopilotPanel (AI Chat + Widgets)            │
│             ├─► RiskPanel / EtaPanel / CongestionPanel      │
│             └─► RoutingPanel / TopMetrics / RecentShipments │
│                                                             │
│  Socket.IO Client ◄──────────────────────────────────────┐  │
│  Axios HTTP Client ──────────────────────────────────┐   │  │
└──────────────────────────────────────────────────────│───│──┘
                                                       │   │
                                         REST API   WS │   │ Events
                                                       │   │
┌──────────────────────────────────────────────────────│───│──┐
│                       BACKEND (Express)              │   │  │
│                                                      ▼   ▼  │
│  POST /api/risk-score      ──► riskEngine            │   │  │
│  POST /api/alternate-route ──► routingEngine (A*)    │   │  │
│  POST /api/predict-eta     ──► etaEngine             │   │  │
│  POST /api/detect-bottleneck ► congestionEngine      │   │  │
│  POST /api/copilot/query   ──► copilotEngine         │   │  │
│                                     │                │   │  │
│              Socket.IO Server ◄─────┴─ eventBus ◄───┘    │  │
│                    │                                      │  │
│         disruptionEngine (12s interval)                   │  │
│           ├─ trafficFeedService                           │  │
│           ├─ weatherFeedService                           │  │
│           └─ graphWeightUpdater                           │  │
│                    │                                      │  │
│         routeRecomputeEngine ──► astar.ts ──► graph.ts    │  │
│                    │                                      │  │
│              eventBus.emit(ROUTE_RECOMPUTED) ─────────────┘  │
│                                                              │
│  AI Layer: geminiClient.ts (mock — structured responses)     │
└──────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ 
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/RaoSBK/Help-Logistics.git
cd Help-Logistics/ai-supply-chain-predictor
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:3001
```

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

### 4. Open the WebApp

Navigate to **https://frontend-cyan-five-79.vercel.app/** in your browser. The dashboard will connect to the backend via WebSocket automatically and begin the live disruption simulation.

### Available Scripts

**Backend:**
```bash
npm run dev      # Start dev server with nodemon (hot reload)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled output (production)
```

**Frontend:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
# Add your Gemini API key here when integrating real AI:
# GEMINI_API_KEY=your_key_here
```

The frontend connects to `http://localhost:3001` by default (configured in `src/api/index.ts`).

---

## API Reference

**Base URL:** `http://localhost:3001/api`

All endpoints accept and return JSON.

---

### `POST /api/risk-score`

Calculates a risk score for a given route based on weather, traffic, and time factors.

**Request Body:**
```json
{
  "route": "A-D",
  "weather": "rainy",
  "traffic": 70,
  "timeOfDay": "rush"
}
```

**Response:**
```json
{
  "score": 62,
  "level": "High",
  "explanation": "...",
  "factors": {
    "route": 25,
    "weather": 24,
    "traffic": 28,
    "time": 13
  }
}
```

| Field   |  Type  |    Description     |
|---------|--------|--------------------|
| `score` | number | Risk score (10–90) |
| `level` | string | `Low` / `Medium` / `High` |
| `explanation` | string | AI-generated explanation |
| `factors` | object | Breakdown of contributing risk factors |

---

### `POST /api/alternate-route`

Finds an optimal alternate route using A\* pathfinding.

**Request Body:**
```json
{
  "start": "A",
  "end": "D",
  "preference": "fastest"
}
```

**Preference options:** `fastest` | `safest` | `balanced` | `eco`

**Response:**
```json
{
  "originalRoute": ["A", "B", "D"],
  "alternateRoute": ["A", "C", "E", "D"],
  "distance": 100,
  "reason": "Primary route blocked due to traffic closure on B→D"
}
```

---

### `POST /api/predict-eta`

Predicts delivery ETA with disruption-aware delay modeling.

**Request Body:**
```json
{
  "baseTimeMinutes": 120,
  "disruptionEvent": {
    "type": "traffic",
    "from": "A",
    "to": "B",
    "severityMultiplier": 2
  }
}
```

**Response:**
```json
{
  "totalEtaMinutes": 185,
  "breakdown": {
    "base": 120,
    "trafficDelay": 42,
    "weatherDelay": 0,
    "congestion": 17,
    "riskBuffer": 6
  },
  "confidence": 78,
  "estimatedArrival": "2025-01-15T14:30:00.000Z",
  "explanation": "Adjusted due to predicted traffic congestion on route A to B."
}
```

---

### `POST /api/detect-bottleneck`

Detects congestion and bottlenecks across the network.

**Request Body:**
```json
{
  "region": "North Corridor"
}
```

**Response:**
```json
{
  "detected": true,
  "severity": "High",
  "severityScore": 78,
  "cause": "High utilization on B→D corridor",
  "affectedNodes": ["B", "D"],
  "bottleneckEdge": { "from": "B", "to": "D" },
  "criticalPath": ["A", "B", "D"],
  "metrics": {
    "avgLatency": 45,
    "peakLoad": 87,
    "congestionIndex": 72,
    "affectedTrafficPct": 60
  },
  "recommendation": "Reroute via C→E corridor",
  "warning": "Severe delays expected on primary path",
  "timestamp": 1736945200000
}
```

---

### `POST /api/copilot/query`

Sends a natural language query to the Logistics AI Copilot.

**Request Body:**
```json
{
  "query": "What should I do about the current disruption?",
  "shipmentDetails": {
    "id": "SHP-123",
    "status": "IN_TRANSIT"
  }
}
```

**Response:**
```json
{
  "textResponse": "I have analyzed the disruption. Rerouting via A→C→E→D avoids the closure entirely...",
  "riskLevel": "LOW",
  "recommendation": "Reroute via A→C→E→D",
  "uiComponent": "RouteRecommendationWidget",
  "uiPayload": {
    "originalRoute": "A→B→D",
    "newRoute": "A→C→E→D",
    "timeImpact": "+15 mins",
    "riskReduction": "65%"
  },
  "confidenceScore": 0.98
}
```

The `uiComponent` field instructs the frontend to render a specific inline widget:
- `RouteRecommendationWidget` — displays original vs. new route comparison
- `RiskAssessmentWidget` — displays risk level and primary factors
- `null` — text-only response

---

## WebSocket Events

The backend runs a Socket.IO server on the same port as the REST API (`3001`).

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `start_simulation` | `{ start: "A", end: "D" }` | Begin the disruption simulation loop |
| `stop_simulation` | — | Stop the simulation loop |
| `request_refresh` | — | Manually trigger a disruption event |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `initial_route` | Route object | Sent on first connection with the current optimal route |
| `route_update` | Route update object | Broadcast every 12 seconds with recomputed route data |

**Route Update Payload:**
```json
{
  "originalRoute": ["A", "B", "D"],
  "alternateRoute": ["A", "C", "E", "D"],
  "metrics": {
    "originalTime": 20,
    "alternateTime": 35,
    "delta": "+15 mins"
  },
  "disruptionEvent": {
    "type": "traffic",
    "from": "B",
    "to": "D",
    "severity": "high",
    "message": "Road closure detected on B→D"
  },
  "explanation": "Rerouted due to traffic closure..."
}
```

---

## Frontend Features

### Dashboard Layout

The app renders a single `Dashboard` page composed of:

```
┌─────────────────────────────────────────────────────┐
│ Sidebar (fixed, 256px)  │  Header                   │
│                         │─────────────────────────  │
│  - Navigation links     │  TopMetrics (KPI cards)   │
│                         │─────────────────────────  │
│                         │  [8 cols]    [4 cols]     │
│                         │  Live Route  │  Copilot   │
│                         │  Monitor     │  Chat      │
│                         │─────────────│             │
│                         │  Risk  Cong │  Panel      │
│                         │  ETA   Route│             │
│                         │─────────────────────────  │
│                         │  Recent Shipments Table   │
└─────────────────────────────────────────────────────┘
```

### Copilot Widgets

The Copilot chat can render interactive inline widgets based on AI response intent:

- **RouteRecommendationWidget** — shows original vs. recommended route with time impact and risk reduction
- **RiskAssessmentWidget** — shows current risk level, primary disruption factor, and affected route

### Live Route Visualizer

An SVG-based graph renderer that draws the 5-node network (A→B→C→D→E) and highlights:
- 🟢 Active optimal path
- 🔴 Blocked / disrupted edges
- Animated transitions on route changes

---

## Backend Services

| Service | File | Description |
|---|---|---|
| **Routing Engine** | `routingEngine.ts` | Wraps A\* with live traffic multipliers and preference modifiers |
| **Risk Engine** | `riskEngine.ts` | Computes weighted risk score (route + weather + traffic + time) |
| **ETA Engine** | `etaEngine.ts` | Calculates delivery ETA with delay breakdowns and confidence |
| **Congestion Engine** | `congestionEngine.ts` | Simulates node/edge load metrics and detects bottlenecks |
| **Copilot Engine** | `copilotEngine.ts` | Classifies intents and calls the AI client |
| **Disruption Engine** | `disruptionEngine.ts` | Fires random disruption events on a 12-second interval |
| **Graph Weight Updater** | `graphWeightUpdater.ts` | Applies and resets disruption multipliers on graph edges |
| **Route Recompute Engine** | `routeRecomputeEngine.ts` | Re-runs A\* after weight changes and emits events |
| **Traffic Feed Service** | `trafficFeedService.ts` | Injects traffic delay penalties into the graph |
| **Weather Feed Service** | `weatherFeedService.ts` | Injects weather penalties into the graph |
| **Explanation Engine** | `explanationEngine.ts` | Generates human-readable route change explanations |
| **Event Bus** | `eventBus.ts` | Node.js EventEmitter for internal pub/sub between services |

---

## Graph & Routing Algorithm

### Network Topology

The backend uses a **mock 5-node directed graph** representing a logistics corridor:

```
  [A] Origin Facility
   |  \
   |   \
  [B]  [C] Mountain Pass
   | \   |
   |  \ [E] Valley Route
   |   \ |
  [D] Destination Port
```

**Nodes:**
| ID | Name | Coordinates |
|----|------|-------------|
| A | Origin Facility | (0, 0) |
| B | Highway Checkpoint 1 | (10, 0) |
| C | Mountain Pass | (5, 10) |
| D | Destination Port | (20, 0) |
| E | Valley Route | (15, 10) |

**Base Edges:**
| From | To | Weight (mins) |
|---|---|---|
| A | B | 10 |
| A | C | 15 |
| B | D | 10 |
| B | C | 10 |
| C | D | 20 |
| C | E | 10 |
| E | D | 10 |

### A\* Pathfinding

The routing engine uses **A\* search** with a Euclidean distance heuristic based on node coordinates. Effective edge weight is calculated as:

```
effectiveWeight = baseWeight × disruptionMultiplier × trafficMultiplier × jitter
```

- `disruptionMultiplier = Infinity` signals a **full road closure** (edge is impassable)
- `jitter` adds ±9% random variance to simulate real-world variability

### Route Preferences

The `preference` parameter adjusts edge weights before pathfinding:

| Preference | Behavior |
|---|---|
| `fastest` | No modification — pure weight optimization |
| `safest` | Penalizes Mountain Pass (C) and Valley Route (E) by 30% |
| `balanced` | Penalizes Mountain Pass (C) by 15% |
| `eco` | Penalizes Mountain Pass (C) and Valley Route (E) by 35% |

---

## AI Layer

### Current State (Mock)

The `geminiClient.ts` file currently implements a **mock AI client** — no real Gemini API calls are made. Responses are returned from hardcoded templates with a simulated 800ms delay.

Intent routing:
- `ROUTE_ADVICE` → returns rerouting recommendation with `RouteRecommendationWidget`
- `RISK_INQUIRY` → returns risk assessment with `RiskAssessmentWidget`
- Fallback → returns generic monitoring advice

### Integrating Real Gemini AI

To connect a live Gemini API:

1. Add your key to `backend/.env`:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

2. Replace the mock functions in `src/ai/geminiClient.ts` with real `@google/generative-ai` SDK calls:
   ```typescript
   import { GoogleGenerativeAI } from '@google/generative-ai';
   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
   ```

---

## Known Limitations & TODOs

- [ ] **Mock AI** — `geminiClient.ts` uses hardcoded responses; real Gemini API not yet integrated
- [ ] **Mock graph** — Network is 5 static nodes; not connected to real geo/map data
- [ ] **No database** — All state is in-memory; resets on server restart
- [ ] **No authentication** — CORS is open (`*`); no user auth layer
- [ ] **No frontend state persistence** — Zustand store is ephemeral
- [ ] **Unidirectional graph** — Edges are one-directional; reverse routes are not modeled
- [ ] **Single route pair** — Simulation is fixed to `A → D`; multi-origin/destination not yet supported
- [ ] **No tests** — No unit or integration test suite

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

ISC License — see `package.json` for details.

---

#  Contact

If you have any questions, suggestions, or would like to collaborate, feel free to reach out!

- **Developer:** Suraj  Bhan , Shivam, Sahid, Wahid   
- **Project:** Ship Guard AI (Help Logistics) 

- **Email:** correctinfoweb@gmail.com 
- **GitHub:** https://github.com/RaoSBK/Help-Logistics.git
- **Ppt link:** https://drive.google.com/file/d/1SEFkQmj_OMEO-k0CP1MDoPhuHKQUUx8t/view?usp=drive_link
- **Video link:** https://drive.google.com/file/d/1Hv5mBIy7h6IfpyS_HTWj6NRBvJ-ebmuP/view?usp=sharing 
- **Youtube link:** https://youtu.be/vfZh4O6DjTY
---

<div align="center">
  <sub>Built with ❤️ for supply chain resilience</sub>
</div>