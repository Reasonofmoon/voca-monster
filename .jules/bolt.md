
## 2024-03-21 - [O(1) String Splitting Optimization in React]
**Learning:** When highlighting words in a React component using `String.prototype.split` with a capturing regex group (e.g., `/(word1|word2)/gi`), the resulting array guarantees that the matched words are always at odd indices (1, 3, 5, etc.). This means we can replace expensive O(N) `.some()` lookups inside the `.map()` render loop with a simple O(1) index check (`index % 2 === 1`).
**Action:** Always check if we can leverage the inherent mathematical properties of an API's return value (like capturing group split indices) to replace iterative array searches, especially inside render loops.
