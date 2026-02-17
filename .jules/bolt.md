## 2025-02-23 - Vite process.env Polyfill
**Learning:** Vite applications do not polyfill `process.env` by default, causing runtime errors if imported libraries rely on it (e.g., Google GenAI SDK).
**Action:** Always check `vite.config.ts` for `define: { 'process.env': {} }` if you encounter `process is not defined` errors.

## 2025-02-23 - Regex Split Optimization
**Learning:** `String.prototype.split` with a capturing group includes captured groups in the result array at odd indices. This allows O(N) rendering logic for highlighted text instead of O(N*M) checks.
**Action:** Use this pattern for text highlighting or tokenization tasks.
