## 2024-05-24 - [O(n) React Rendering Bottleneck in AnalyzedContent]
**Learning:** Found an O(n) rendering bottleneck where `highlightWords.some()` was called for every split text part. Since `String.prototype.split` with a capturing regex guarantees matched groups appear at odd indices, array search can be replaced by a simple O(1) index parity check (`index % 2 === 1`).
**Action:** When mapping over text split by a capturing regex in React, use index parity to identify matches instead of searching an array for every iteration.
