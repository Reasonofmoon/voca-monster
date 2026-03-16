## 2024-05-15 - [O(N) to O(1) text matching in React Mapping]
**Learning:** O(N) lookup functions like `Array.prototype.some` inside mapped React renders can lead to poor performance, particularly with long arrays of text splits. A capturing regex group inside `String.prototype.split` reliably places matched terms at odd indices.
**Action:** When rendering split text matching specific words using capturing groups, replace `some()` or `includes()` lookups with a fast O(1) modulo parity check (`index % 2 === 1`) to determine if a part is a matched highlight.
