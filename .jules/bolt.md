## 2024-05-20 - AnalyzedContent Highlight Rendering Optimization
**Learning:** `String.prototype.split()` using a regex with a single capturing group places the captured matches exactly at odd indices in the resulting array. This allows skipping array searches (`.some()`/`.includes()`) when mapping the parts.
**Action:** Use `index % 2 === 1` for O(1) identification of highlighted tokens when iterating over arrays split by a capturing regex.
