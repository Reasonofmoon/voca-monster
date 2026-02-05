# Bolt's Journal

## 2024-05-22 - [Optimizing Component Re-renders]
**Learning:** Large React components (like App.tsx) containing inline sub-components cause unnecessary re-renders of those sub-components when the parent state changes, even if the sub-component props remain stable.
**Action:** Extract inline components to standalone files and use `React.memo` to prevent re-renders when props are stable, especially for components with expensive rendering logic (like regex splitting).
