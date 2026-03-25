## 2024-05-24 - [O(1) lookups for capturing regex splits]
**Learning:** When using `String.prototype.split` with a capturing regex, odd indices in the resulting array are guaranteed to be matches.
**Action:** Replace O(N) array inclusion checks (like `.some()`) with an O(1) mathematical check (`index % 2 === 1`) for significant performance wins, especially when dealing with long strings or large arrays of words to match.
