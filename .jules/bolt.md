
## 2025-06-11 - String highlighting regex escaping regression
**Learning:** When refactoring or extracting string interpolation and regex logic, specifically `replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')`, the backslashes used to escape closing brackets (like `\]`) are extremely sensitive. Attempting to "fix" or inadvertently adding another backslash (`\\]`) modifies the regex logic entirely, closing the class early and causing application crashes with inputs that include regex special characters.
**Action:** When extracting or refactoring existing regex escape logic inside `replace_with_git_merge_diff`, never attempt to add extra backslashes to escape existing backslashes, as it introduces fatal syntax errors. Always copy the original sequence exactly without modification.
