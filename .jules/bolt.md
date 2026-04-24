## 2024-05-18 - Fast String Matching with Regex Split
**Learning:** Text highlighting in `AnalyzedContent` uses `String.prototype.split` with a capturing regex. Odd indices in the resulting array are guaranteed to be matches, enabling O(1) identification (e.g., `index % 2 === 1`) instead of O(M * N) using `.some()`.
**Action:** Always use the array index (`index % 2 === 1`) for exact match identification when splitting with a capturing group regex, bypassing costly lookups inside rendering loops.
