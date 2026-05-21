## 2024-05-21 - AnalyzedContent (N)$ to (1)$ Highlighting Optimization
**Learning:** Text highlighting in `AnalyzedContent` uses `String.prototype.split` with a capturing regex. Because of how the ECMAScript spec works, odd indices in the resulting array are *always* the captured matches.
**Action:** Instead of running an expensive (N)$ `.some()` lookup over the array of highlighted words to check if a segment matches, use an (1)$ index modulo check (`index % 2 === 1`) during the `.map()` render cycle.
