## 2024-03-15 - O(1) text highlighting and memoization
**Learning:** Text highlighting in React by splitting on regex capturing groups places matching text precisely at odd indices. Searching the original text matches list in O(M) for each text slice can cause O(N*M) performance drops on large text block parsing when O(N) is feasible by simply checking `index % 2 === 1`.
**Action:** Always prefer utilizing array indices to verify regex matches instead of looping over array items for highlighting logic. And memoize string parsing where feasible to skip identical executions on re-renders.
