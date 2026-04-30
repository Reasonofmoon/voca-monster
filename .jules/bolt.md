## 2024-04-30 - O(1) Parsing with Capturing Group Regex Splits
**Learning:** In `AnalyzedContent`, using `String.prototype.split` with a capturing group regex guarantees that the resulting array alternates exactly between non-matched and matched strings, where odd indices are always the exact matched capture groups.
**Action:** When mapping over split string parts for highlighting or replacing, rely on the `index % 2 === 1` mathematical certainty rather than re-computing heavy array checks (`Array.prototype.some()`) against the original matching set.
