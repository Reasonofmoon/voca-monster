## 2024-05-31 - Memoize Array Logic during Map Renders
**Learning:** When dealing with component props that require mapping strings to React nodes via regular expressions, `String.prototype.split(regex)` puts capturing group matches at odd indices, providing an O(1) mathematical lookup vs an O(N) `.some()` lookup across all tokens.
**Action:** Opt for `index % 2 === 1` index math checks rather than secondary `some/find` operations within component loops.
