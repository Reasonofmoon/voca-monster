## 2026-03-08 - O(1) identification in Split String with Capturing Groups
**Learning:** When using `String.prototype.split` with a capturing regex group (like `new RegExp('\\b(word)\\b', 'gi')`), the resulting array consistently places matches at odd indices. This transforms an O(N) array `.some()` or `.includes()` lookup into a highly efficient O(1) index check `index % 2 === 1`.
**Action:** Use the `index % 2 === 1` check whenever mapping over a split array that used capturing groups for highlighting matched terms instead of searching an array to see if the part is a match.
