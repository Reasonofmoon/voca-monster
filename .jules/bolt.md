## 2024-05-22 - [React.memo for Expensive Regex]
**Learning:** `AnalyzedContent` component was re-calculating a complex regex and splitting a potentially large string on every parent render, even when its props were unchanged. This is a classic "unnecessary work" pattern in React when parent state updates frequently (like checkboxes).
**Action:** Always check components with heavy computation (regex, sorting, filtering) for unnecessary re-renders, especially if they are children of a state-heavy parent. Used `React.memo` to skip re-renders when props are stable.
