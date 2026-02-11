# Deepfake Daily

A collaborative research log for tracking deepfake-related data — incidents, terminology, and policy developments. Upload research data, discover AI-powered correlations, and visualize connections through an interactive network graph.

**Live site:** https://sbleeyouk.github.io/deepfake_daily/

## Overview

Deepfake Daily allows researchers to:

- **Upload research data** — news articles, papers, YouTube links, PDFs, images, and notes with category/tag classification
- **AI-generated summaries** — Claude AI auto-generates headlines and analyzes thematic correlations between entries
- **Network graph visualization** — interactive force-directed graph showing how data points connect, color-coded by category
- **Feed view** — chronological log of all entries with thumbnails, tags, and timestamps
- **Filter and explore** — filter by category (Terminology, Incident, Law/Policy) or tags across both views

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Backend | Express + TypeScript |
| Database | Notion API |
| AI | Anthropic Claude API |
| Graph | react-force-graph-2d |
| Auth | JWT with email domain gate |
| Hosting | GitHub Pages (frontend) + Render (backend) |

## Pages

### Homepage
Landing page with research title, project description, and navigation to Add Data or View Data.

### Add New Data (`/add`)
Requires login with an approved email domain. The submission form includes:
- **Summary Headline** — manually entered or AI-generated from attached content
- **Category** — single select: Terminology / Incident / Law,Policy
- **Tags** — multi-select from predefined list + custom tags
- **Comments & Thoughts** — free-text notes
- **Attachment** — paste a URL or upload a file (PDF, image, video); thumbnails are auto-extracted from URLs
- **Time Occurred** — optional date for when the event happened
- A confirmation dialog verifies factual accuracy before submission

### View Data (`/view`)
Two view modes with shared category/tag filters:
- **Network Graph** — force-directed graph where nodes are entries, edges are AI-detected correlations. Hover to highlight connections, click to view details.
- **Feed View** — chronological list showing headline, thumbnail, category, tags, and timestamp. Click any entry to view details.

Both views share a **detail panel** that slides in from the right with full entry data and an edit option.

## Getting Started

### Prerequisites
- Node.js 18+
- A [Notion integration](https://www.notion.so/my-integrations) with a database shared to it
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone and install

```bash
git clone https://github.com/SBleeyouk/deepfake_daily.git
cd deepfake_daily
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Set up Notion database

Create a Notion database with these properties:

| Property | Type | Notes |
|----------|------|-------|
| Title | title | Summary headline |
| Category | select | Options: `Terminology`, `Incident`, `Law/Policy` |
| Tags | multi_select | Predefined + user-created tags |
| Comments | rich_text | Notes and thoughts |
| AttachmentURL | url | Link to external resource |
| AttachmentFile | files | Uploaded file |
| ThumbnailURL | url | Extracted or manual thumbnail |
| TimeAdded | date | Auto-filled on submission |
| TimeOccurred | date | Optional event date |
| SubmittedBy | rich_text | Submitter email |
| CorrelationData | rich_text | AI-generated correlation JSON |

Share the database with your Notion integration.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
ANTHROPIC_API_KEY=your_anthropic_api_key
ALLOWED_EMAIL_DOMAIN=mit.edu
JWT_SECRET=your_random_secret
PORT=3001
CORS_ORIGIN=https://sbleeyouk.github.io
```

### 4. Run locally

```bash
npm run dev
```

This starts both the Express server (`http://localhost:3001`) and the Vite dev server (`http://localhost:5173`).

## Deployment

### Frontend — GitHub Pages

Deployed automatically via GitHub Actions on push to `main`. The workflow is defined in `.github/workflows/deploy.yml`.

Set the `VITE_API_URL` repository variable (Settings > Secrets and variables > Actions > Variables) to your backend URL.

### Backend — Render

Deployed as a Web Service on Render with:
- **Root Directory:** `server`
- **Build Command:** `npm install && npx tsc`
- **Start Command:** `node dist/index.js`
- **Environment Variables:** same as `.env` above

## File Structure

```
deepfake_daily/
├── .env.example                        # Environment variable template
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Pages deploy workflow
├── package.json                        # Root scripts (concurrently runs both)
│
├── server/                             # Express API backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                    # Express app entry point
│       ├── config.ts                   # Environment variable loading
│       ├── middleware/
│       │   └── auth.ts                 # JWT verification middleware
│       ├── routes/
│       │   ├── auth.ts                 # POST /api/auth/login
│       │   ├── entries.ts              # GET/POST/PATCH /api/entries
│       │   ├── ai.ts                   # POST /api/ai/generate-headline, correlations
│       │   └── uploads.ts              # POST /api/uploads (file + thumbnail)
│       ├── services/
│       │   ├── notion.ts               # Notion API CRUD wrapper
│       │   ├── claude.ts               # Anthropic Claude SDK (headlines, correlations)
│       │   └── thumbnail.ts            # Open Graph image extraction
│       └── types/
│           └── index.ts                # Shared TypeScript types
│
├── client/                             # React + Vite frontend
│   ├── package.json
│   ├── vite.config.ts                  # Vite config (proxy + base path)
│   ├── tsconfig.json
│   ├── index.html
│   ├── public/
│   │   └── 404.html                    # GitHub Pages SPA redirect
│   └── src/
│       ├── main.tsx                    # React entry point
│       ├── App.tsx                     # Router setup with basename
│       ├── theme.ts                    # Color scheme constants
│       ├── api/
│       │   └── client.ts              # API fetch wrapper (configurable base URL)
│       ├── hooks/
│       │   ├── useAuth.ts             # Auth state (login/logout/token)
│       │   ├── useEntries.ts          # Fetch entries with filters
│       │   └── useGraphData.ts        # Fetch and transform graph data
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx         # Sticky header with nav buttons
│       │   │   ├── Footer.tsx         # Logo, contact, rights
│       │   │   └── Layout.tsx         # Header + Outlet + Footer
│       │   ├── common/
│       │   │   ├── Button.tsx         # Reusable button (primary/outline/ghost)
│       │   │   ├── Modal.tsx          # Overlay modal
│       │   │   ├── CategorySelect.tsx # Single-select category pills
│       │   │   ├── TagSelect.tsx      # Multi-select tags with custom input
│       │   │   └── FilterBar.tsx      # Category + tag filter controls
│       │   ├── home/
│       │   │   └── HeroSection.tsx    # Landing hero with CTA buttons
│       │   ├── add/
│       │   │   ├── LoginGate.tsx      # Email domain auth gate
│       │   │   ├── EntryForm.tsx      # Full data submission form
│       │   │   └── ConfirmModal.tsx   # "Double check" confirmation dialog
│       │   └── view/
│       │       ├── NetworkGraph.tsx   # Force-directed graph (hover/click)
│       │       ├── FeedView.tsx       # Chronological entry list
│       │       ├── FeedCard.tsx       # Single entry card in feed
│       │       ├── DetailPanel.tsx    # Slide-in panel with edit mode
│       │       └── ViewToggle.tsx     # Network/Feed view switcher
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── AddDataPage.tsx
│       │   └── ViewDataPage.tsx
│       └── styles/
│           └── global.css             # Dark theme base + responsive styles
```

## Color Scheme

| Token | Color | Usage |
|-------|-------|-------|
| Background | `#0A0A0A` | Main background |
| Card Background | `#141414` | Panels, cards |
| Text | `#F5F5F5` | Primary text |
| Muted Text | `#A0A0A0` | Secondary text |
| Terminology | `#6C5CE7` | Purple — category + graph nodes |
| Incident | `#FF6B6B` | Red — category + graph nodes |
| Law/Policy | `#00B894` | Teal — category + graph nodes |
| Accent | `#4ECDC4` | Buttons, links, default nodes |
| Highlight | `#FF6B6B` | Hovered graph connections |
