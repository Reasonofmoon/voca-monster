## 2024-05-19 - [O(1) String Highlighting Optimization]
**Learning:** Text highlighting that relies on splitting text using a regular expression with a capturing group implicitly places all the matches at odd indices in the resulting array. This means an O(N*M) loop that checks `array.some(match => textChunk === match)` can be safely optimized to an O(1) index check (`index % 2 === 1`).
**Action:** When optimizing string splitting components across codebases, always check if a capturing regex was used; if so, replace expensive substring lookups with parity checks on the array index.
