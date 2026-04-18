## 2026-04-18 - O(1) Array Highlighting
**Learning:** String.prototype.split with capturing regex groups guarantees that odd indices are matches. This allows converting an O(N) lookup (highlightWords.some) inside a .map loop to O(1) by simply checking index % 2 === 1.
**Action:** Use index parity checks when iterating over split parts from capturing regexes instead of re-evaluating matches.
