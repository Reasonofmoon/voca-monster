## 2024-07-05 - O(1) text highlighting with regex capturing groups
**Learning:** Text highlighting that relies on regex `split()` with capturing groups places the exact matched substring at odd indices. Iterating over the split array and matching parts using `Array.some(match => match === part)` scales O(N*M) where N is array length and M is number of highlighted words.
**Action:** Replace `some()` check with a O(1) index check `index % 2 === 1` for a faster rendering, and additionally memoize the text splitting process and component if it receives frequent re-renders from parent components.
