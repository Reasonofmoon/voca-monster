## 2025-05-18 - Efficient Text Highlighting Pattern
**Learning:** When splitting text using a regex with capturing groups `(\b(word)\b)`, the resulting array always contains matches at odd indices. This allows O(1) identification of highlighted segments instead of O(M) lookup.
**Action:** Use this pattern for all text highlighting features to avoid nested loops.
