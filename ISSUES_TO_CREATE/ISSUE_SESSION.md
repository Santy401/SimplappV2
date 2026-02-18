# Issue: Session Management and Authentication Enhancements

## Description
Improve the session management system to handle token expiration, protected routes, and persistent state more effectively.

## Changes
- **use-session Hook**: Refactored to provide more reliable session state and methods.
- **SessionExpiredModal**: A modal that appears when the session expires, prompting the user to re-login without losing context.
- **ProtectedRoute**: Enhanced component to guard routes and redirect unauthenticated users efficiently.
- **fetchWithAuth**: A wrapper around fetch that automatically handles token attachment and 401 responses.
- **Contexts**: Added `SessionContext`, `NavigationContext`, and `AppStateContext` for better global state management.
- **usePersistedState**: Hook to persist state to localStorage (used for session and navigation).

## Branch
`feat/session-auth`
