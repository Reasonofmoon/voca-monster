## 2024-04-11 - O(1) RegExp Capture Group Matching
**Learning:** When using `String.prototype.split()` with a capturing group in the regular expression, the resulting array interleaves the unmatched text with the captured text. This means captured matches are guaranteed to be at odd indices (1, 3, 5...).
**Action:** Replace expensive O(N) array searches (like `.some()`) inside `.map()` loops over split text with a simple `index % 2 === 1` O(1) check to identify highlighted matches.
