## 2024-05-21 - O(1) Match Identification with String.split
**Learning:** Text highlighting in AnalyzedContent uses `String.prototype.split` with a capturing regex; odd indices in the resulting array are guaranteed to be matches, enabling O(1) identification instead of O(N) array lookups.
**Action:** Apply this mathematical pattern (`index % 2 === 1`) when mapping over text segments created by capturing split operations to avoid redundant string comparisons.
