## 2024-05-18 - [O(1) Array Check with Regex Splitting]
**Learning:** In AnalyzedContent, using `String.prototype.split` with a capturing regex is an efficient way to highlight matches because odd indices in the resulting array are guaranteed to be matches, allowing an O(1) check (`index % 2 === 1`) instead of `Array.some()`.
**Action:** Use this O(1) matching strategy in future string highlighting logic to prevent unnecessary O(N) comparisons during rendering.
