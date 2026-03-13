## 2024-05-24 - [Optimize Text Highlighting Lookup]
**Learning:** Using `String.prototype.split` with a capturing group regex guarantees matches are placed at odd indices in the resulting array. This allows for an O(1) index check (`index % 2 === 1`) instead of performing an O(N*M) lookup using `some(...)` against the highlight list.
**Action:** Always prefer the index property over array iteration (`some`, `includes`) when parsing parts created by a splitting capturing group for highlighting UI elements.
