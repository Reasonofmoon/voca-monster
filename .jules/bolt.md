## 2024-05-20 - [O(1) Token Identification via String.prototype.split Capture Groups]
**Learning:** In JavaScript, when splitting a string with a RegExp that contains a capture group (`String.prototype.split(/(group)/)`), the resulting array reliably interleaves unmatched strings at even indices and captured matches at odd indices.
**Action:** Replace `O(N)` array searches (like `.includes()` or `.some()`) on every split chunk with a simple `index % 2 === 1` check for massive performance gains when rendering syntax-highlighted or analyzed text.
