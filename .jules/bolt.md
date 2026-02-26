## 2024-05-22 - Regex Construction in Render Loop
**Learning:** Constructing complex regexes inside the render loop (even outside effects) can be expensive, especially when derived from array props.
**Action:** Always memoize regex construction derived from props using `useMemo`, and consider extracting the component to use `React.memo` if the parent re-renders frequently.
