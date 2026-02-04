## 2024-05-22 - Component Definition and Memoization
**Learning:** Even if components are defined outside the render loop, they still re-render when the parent renders unless memoized. For components with expensive computations (like regex), `React.memo` and `useMemo` are critical.
**Action:** Use `React.memo` for components with stable props and `useMemo` for expensive derived state.

## 2024-05-22 - Vite Process Env Polyfill
**Learning:** This project uses `process.env` in client-side code (likely for API keys), but Vite does not polyfill this by default.
**Action:** Ensure `define: { 'process.env': {} }` is present in `vite.config.ts` to prevent runtime errors.
