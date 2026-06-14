## 2024-06-14 - O(1) Regex Matching Check
**Learning:** Using `String.prototype.split` with a capturing regex guarantees that odd indices in the resulting array correspond strictly to the matched groups.
**Action:** Replace expensive `Array.prototype.some` or `Array.prototype.includes` checks on highlighted text blocks with simple `index % 2 === 1` O(1) mathematical evaluations to improve rendering performance.
