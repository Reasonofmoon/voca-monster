# Bolt's Performance Journal

This file tracks critical performance learnings, bottlenecks, and optimization insights for the codebase.

## Format
`## YYYY-MM-DD - [Title]
**Learning:** [Insight]
**Action:** [How to apply next time]`

## 2024-05-22 - Extracted and Memoized AnalyzedContent
**Learning:** Extracting `AnalyzedContent` and `VocabularyList` from `App.tsx` and wrapping them in `React.memo` prevents expensive regex operations and re-renders when parent state changes.
**Action:** Always consider extracting heavy computational components (like those doing regex or complex mapping) and memoizing them if they are re-rendered frequently by parent state.
