## 2025-04-02 - String.split() and Regex Capturing Groups
**Learning:** Using `String.prototype.split` with a capturing regex guarantees that odd indices in the resulting array correspond to matches. This enables replacing O(N) array lookups per chunk with an O(1) modulo check (`index % 2 === 1`).
**Action:** Use this O(1) pattern when iterating over split components and conditionally rendering them based on whether they were matches, rather than looking up the text against the original keyword array.

## 2025-04-02 - React.memo ExoticComponent Typing
**Learning:** `React.memo()` returns a `MemoExoticComponent`. Providing type arguments to the memo function call (`React.memo<Props>(...)`) is correct and avoids TypeScript errors when trying to explicitly define the returned variable as `React.FC<Props>`.
**Action:** Apply generic types to the `React.memo` invocation (`React.memo<T>`) rather than defining component variable types to `React.FC<T>`.
