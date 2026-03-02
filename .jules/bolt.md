## BOLT'S JOURNAL

## 2024-05-30 - O(N) to O(1) Replacement in `split` matching
**Learning:** React matching components performing string array checking can be extremely slow if implemented using `Array.prototype.some` for every text segment checking for a highlighted string. Since we use `String.prototype.split` with a capturing group in the split regex, the matched sub strings are guaranteed to be placed precisely at the odd indices of the returned array. Therefore, instead of searching the highlighted words list for each segment (`O(N)` for each segment), we can perform an `O(1)` check `index % 2 === 1`.
**Action:** When working on highlights or matching words with regex captures against a list of text tokens, consider structural guarantees of native JS functions to improve from linear to constant time checks.
