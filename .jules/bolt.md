## 2023-10-24 - O(1) Highlighting using Regex Capture
**Learning:** Text highlighting that relies on array `.some()` inside `.map()` creates an O(N*M) bottleneck. However, using a capturing group in the `RegExp` followed by `String.prototype.split()` guarantees that all matches end up at odd indices in the resulting array. This provides an elegant O(1) alternative to `.some()` lookup.
**Action:** Always prefer `index % 2 === 1` for O(1) identification of matches when splitting text with a capturing group regex.
