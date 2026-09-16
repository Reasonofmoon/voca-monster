## 2024-05-18 - Fast Match Identification with Capturing Regexes
**Learning:** When using `String.prototype.split` with a capturing regex, odd indices in the resulting array are guaranteed to be the matches. This enables O(1) identification instead of O(N*M) lookups against the original highlight list.
**Action:** Use `index % 2 === 1` to instantly identify matches when rendering highlighted text from a regex split, avoiding expensive array lookups per chunk.
