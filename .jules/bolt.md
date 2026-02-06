## 2024-05-22 - [Refactor] Extract and Memoize Expensive Components
**Learning:** `AnalyzedContent` component was defined inside `App.tsx` and performed expensive RegExp creation and string splitting on every render. Since `App.tsx` handles frequent state updates (e.g., progress tracking), this caused unnecessary computations.
**Action:** Extracted `AnalyzedContent` and `VocabularyList` to separate files and wrapped them in `React.memo` to prevent re-renders when props are stable.
