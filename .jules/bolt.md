## 2024-05-22 - Regex Splitting for Highlighting
**Learning:** Using a capturing group in `String.prototype.split` (e.g., `/(\bmatch\b)/`) guarantees that odd-indexed elements in the resulting array are the matches. This allows O(1) identification of highlighted terms without needing array searches like `.some()` or `.includes()` which would be O(N*M).
**Action:** When implementing text highlighting or segmentation, use capturing groups in the split regex and rely on odd indices to identify matches efficiently.
