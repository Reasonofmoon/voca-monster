## 2024-04-01 - Optimizing React Re-renders with regex match guarantee
**Learning:** `String.prototype.split` with a capturing group is guaranteed to have the matched items at odd indices in the returned array. This allows transforming an O(N*M) lookup inside an array map during React render into an O(1) mathematical index check (`index % 2 === 1`).
**Action:** When mapping over text split by a capturing regex in React components, replace `.includes()` or `.some()` lookups with an index parity check to drastically improve rendering performance, especially for long text blocks.
