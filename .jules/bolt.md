## 2024-03-09 - [O(1) Regex Split Match Identification]
**Learning:** When using `String.prototype.split` with a capturing regex, matches are guaranteed to be placed at odd indices in the resulting array. This allows O(1) identification of matches using `index % 2 === 1`, avoiding O(N) `.some()` lookups for each segment during render loops.
**Action:** Always check the resulting array structure when using capturing groups in `split()` to replace nested loop or array search operations with simple index math.
