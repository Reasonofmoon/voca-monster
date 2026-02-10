## 2024-05-21 - Vite process.env Polyfill
**Learning:** `geminiService.ts` relies on `process.env.API_KEY`, which crashes in Vite development unless polyfilled.
**Action:** Always check `vite.config.ts` for `define: { 'process.env': {} }` or equivalent when encountering `process is not defined` errors in Vite projects using Node-style env vars.
