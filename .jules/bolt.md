## 2024-06-26 - [AnalyzedContent Regex Parsing Performance]
**Learning:** In JavaScript, `String.prototype.split()` using a regex with a capturing group inherently guarantees that matched items are placed at odd indices in the resulting array. This allows transforming an O(N) array search inside a mapping loop into a much faster O(1) modulo index check (`index % 2 === 1`).
**Action:** When implementing syntax or text highlighting using regex splitting, leverage the odd-index guarantee for O(1) match identification instead of relying on `.some()` or `.includes()` lookups.
