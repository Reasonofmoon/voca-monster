## 2024-05-23 - Internal Component Memoization
**Learning:** `AnalyzedContent` defined inside `App.tsx` was re-rendering on parent updates (like checkbox toggles) because it wasn't memoized, causing expensive regex reconstruction and text splitting on every render.
**Action:** Always check if expensive sub-components are memoized, especially when they rely on derived data like regexes constructed from props.
