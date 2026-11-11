# Changelog

What each Ropework release changed, newest first. The same text is shown in the app (Help, What's new) and on the website.

## 0.27.0 (2026-11-11)

- **New:** Release candidate 1: the build to test by hand, after a screen-by-screen design review, an accessibility and copy review, a design-system audit and a security and error-handling pass
- **New:** Running commands show in Activity after a moment with a Cancel button; cancelling stops the work and the program it started at once
- **New:** A failed action after connecting always says so, with Copy details for the exact code and the server's words
- **Fixed:** A panic in one request or task can no longer end the app or freeze the queue; writes have a four-hour deadline; a failed connection never replaces a working one; a server cannot move the workspace folder in the middle of a session; a profile file on a network share is refused
- **Fixed:** Text areas show no system resize grip; controls such as the connection chip and filter chips have a border that meets the 3:1 contrast rule; Settings no longer truncates in the rail; the file panel scrolls; a blocked button says why on screen; History is one click away; the status bar no longer says connected while offline
- **Known:** Still open from the design review: the Full layout's Work pane, file tabs, Owner column and the Preview and Jobs tabs; the 3D toolbar, tool rail and timeline; the Doctor's Repair page; the right pane in Pending, Streams and Spaces; arrow keys in a context menu also move the file selection
