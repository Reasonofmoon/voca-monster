## 2025-02-24 - Text Highlighting with Split
**Learning:** String.prototype.split with a capturing regex /(match)/ guarantees that odd indices in the resulting array are the matches.
**Action:** Use index % 2 === 1 to identify highlighted parts instead of highlightWords.some(...), reducing complexity from O(N*M) to O(1) per part.
