## 2024-03-25 - O(1) Capture Group Highlighting
**Learning:** When using `String.prototype.split` with a capturing regex group (e.g., `/(pattern)/`), the resulting array always interleaves non-matched text with matched text. The matched text is guaranteed to be at odd indices. The existing code checked `highlightWords.some()` for every part, leading to O(N*M) performance for N parts and M highlight words.
**Action:** Replace `Array.prototype.some` iterations on split parts with a simple `index % 2 === 1` check for O(1) identification.
