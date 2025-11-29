# MD Reader

This is a small Vite + React webapp that allows uploading large Markdown files and renders them with a Material Design UI.

Features
- Upload Markdown files (streamed to a web worker to avoid blocking the UI)
- Incremental Table of Contents (TOC) displayed in a side drawer
- Mobile-friendly and responsive layout using Material UI

Getting started

1. Install dependencies:

```bash
cd /workspaces/md-reader
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Open the app at the URL printed by Vite (usually `http://localhost:5173`).

Notes and next improvements
- The worker streams chunks and sends incremental TOC updates; final HTML is produced after upload completes.
- For extremely large documents you can further optimize by streaming parsing or rendering sections lazily.
- Consider adding sanitization policies on the server-side if serving user content to others.
