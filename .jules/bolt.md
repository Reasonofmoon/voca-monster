
## 2024-05-17 - O(1) Capturing Regex Split Index
**Learning:** String.prototype.split with a capturing regex always places matched elements at odd indices (1, 3, 5, etc.) in the resulting array. This allows converting O(N) lookup checks (`matches.some(...)`) into O(1) checks simply by evaluating `index % 2 === 1`.
**Action:** Always prefer index math over Array methods (`.some`, `.includes`) when iterating over the result of a split-by-capturing-group operation to improve array processing performance.
