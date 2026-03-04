## 2025-03-09 - O(1) identification of regex capture matches
**Learning:** Text highlighting in `AnalyzedContent` uses `String.prototype.split` with a capturing regex; odd indices in the resulting array are guaranteed to be matches, enabling O(1) identification rather than O(N) searching for each part.
**Action:** Use this odd-index `index % 2 === 1` pattern when splitting strings with capturing regexes to render UI components without repeating search logic.
