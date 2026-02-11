  deepfake_daily/
  ├── .env.example          # Config template (Notion, Anthropic, auth)
  ├── .gitignore
  ├── package.json          # Root: runs server + client with concurrently
  ├── server/               # Express API backend
  │   └── src/
  │       ├── index.ts      # Express app (cors, routes, static files)
  │       ├── config.ts     # Environment variables
  │       ├── middleware/auth.ts    # JWT auth middleware
  │       ├── routes/
  │       │   ├── auth.ts          # Email domain login
  │       │   ├── entries.ts       # CRUD for Notion entries
  │       │   ├── ai.ts            # Claude headline + correlation APIs
  │       │   └── uploads.ts       # File upload + thumbnail extraction
  │       └── services/
  │           ├── notion.ts        # Notion API wrapper (list, get, create, update)
  │           ├── claude.ts        # Anthropic SDK (headlines, correlations)
  │           └── thumbnail.ts     # OG image scraping
  ├── client/               # React + Vite frontend
  │   └── src/
  │       ├── theme.ts      # Color scheme (dark theme, category colors)
  │       ├── styles/global.css    # Base styles + responsive breakpoints
  │       ├── api/client.ts        # Fetch wrapper for all API calls
  │       ├── hooks/               # useAuth, useEntries, useGraphData
  │       ├── components/
  │       │   ├── layout/   # Header, Footer, Layout (shared)
  │       │   ├── common/   # Button, Modal, CategorySelect, TagSelect, FilterBar
  │       │   ├── home/     # HeroSection
  │       │   ├── add/      # LoginGate, EntryForm, ConfirmModal
  │       │   └── view/     # NetworkGraph, FeedView, FeedCard, DetailPanel, ViewToggle
  │       └── pages/        # HomePage, AddDataPage, ViewDataPage