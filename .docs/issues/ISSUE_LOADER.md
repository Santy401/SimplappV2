# Issue: Unified Loading System Implementation

## Description
Implement a consistent and robust loading system across the application. This includes a new `LoadingV2` component, a `SessionLoader` for initial state, and a global `LoadingContext`.

## Changes
- **LoadingV2 Component**: A standardized loading spinner/indicator for UI consistency.
- **SessionLoader**: Specific loader for session initialization to prevent flash of unauthenticated content.
- **LoadingContext**: Global context to manage and report loading states from any component.
- **useComponentLoading Hook**: Utility hook to easily register component loading states with the global context.

## Branch
`feat/loader-system`
