## 2024-05-18 - String.split Capturing Groups for O(1) Lookup
**Learning:** When using `String.prototype.split` with a capturing regex, the resulting array interleaves unmatched text with the captured groups. The odd indices are guaranteed to be the matches. In `AnalyzedContent`, this allows replacing an O(N) `some()` lookup with an O(1) index check (`index % 2 === 1`).
**Action:** Always use index parity instead of array searches when iterating over results from a splitting regex with capturing groups.
