## 2026-03-23 - [O(1) Identification using Alternating Matches]
**Learning:** String.prototype.split with capturing groups alternates between unmatched and matched strings. This allows for guaranteed matching logic using odd indices (index % 2 === 1).
**Action:** Replaced O(N) array lookup `highlightWords.some(...)` with an O(1) mathematical index check using this specific alternating behavior. Avoid altering existing escaping logic (`\$&`) when refactoring regex components, as it can cause regressions.
