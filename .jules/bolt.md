## 2024-03-24 - O(1) Text Highlighting Optimization
**Learning:** Text highlighting in `AnalyzedContent` previously used an O(N*M) check inside `parts.map` by executing `highlightWords.some(...)`. However, when `String.prototype.split` is used with a capturing regex, odd indices in the resulting array are guaranteed to be the matches. This enables O(1) identification simply by checking if `index % 2 === 1`.
**Action:** Always prefer array indexing checks over repetitive `Array.prototype.some` or `Array.prototype.includes` when processing strings split by capturing regular expressions.
