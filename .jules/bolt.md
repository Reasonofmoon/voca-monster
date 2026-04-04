## 2025-04-04 - [Optimizing Highlight Array Lookups with Capturing Regex]
**Learning:** In React components that split strings using regular expressions with capturing groups, the resulting array has a deterministic pattern where odd-indexed items are *always* the matched substrings.
**Action:** Replace $O(n)$ array lookups (like `.includes()` or `.some()`) inside `.map()` loops with $O(1)$ parity checks (e.g., `index % 2 === 1`) when parsing string tokens split by capturing regex groups.
