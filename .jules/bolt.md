## 2025-02-19 - React Memoization for Regex Operations
**Learning:** React components (like `AnalyzedContent`) that construct complex Regex objects based on props should be memoized. In this app, checking a vocabulary checkbox caused the parent to re-render, forcing `AnalyzedContent` to re-compile a large regex and split the entire text again, causing unnecessary CPU work.
**Action:** Identify expensive derived state (regex, large array transformations) in render bodies and wrap them in `useMemo`, or wrap the component in `React.memo` if props are stable during high-frequency parent updates.
