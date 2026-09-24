## 2024-09-24 - O(1) Regex Split Match Extraction
**Learning:** When using `String.prototype.split` with a capturing regex in React to highlight text, the resulting array has a predictable pattern: odd indices are always the matches. Re-verifying each chunk against the highlight list (O(N*M)) is a redundant bottleneck.
**Action:** Instead of `array.some(word => chunk === word)`, simply check `index % 2 === 1` for O(1) identification.
