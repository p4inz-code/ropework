# Usability walk: twelve tasks for testers and the five-minute expert tour

For each task: do it as someone who has never seen the app, with no help. Note the clicks, any hesitation, and any word you did not understand. A task passes if it is done with no hint and no more than the clicks listed.

| # | Task | Done when | Where a new person is most likely to stall |
| --- | --- | --- | --- |
| 1 | Connect to a server | the main window shows files, the status bar says Connected | step 1 asks for the `p4` client; if it is missing, the page says where to get it (no clickable link in the app) |
| 2 | Find a file | the file is selected and its state and lock are readable | the Find box is called "Find a file or command"; Ctrl+Shift+P |
| 3 | Read a file's state and lock | state in words and an icon; lock owner named in the right panel | the lock is only in the right panel; cards truncate the name ("locked by to...") |
| 4 | Get latest with the preview | see counts, conflicts and size before anything changes, then confirm | the button is blocked until a folder is chosen; the reason is shown |
| 5 | Check out a file | the file shows "edited by you" | Check out is blocked for a file that needs a resolve; the reason is shown under the buttons |
| 6 | Resolve a conflict | one button (Resolve), then a choice; recommended first | four choices behind one menu; "Take theirs" asks first and keeps a copy |
| 7 | Submit with blockers | Submit lists what blocks it, each item has its own fix | the description rule from a studio profile may surprise |
| 8 | Revert with Undo | after Revert, a notice offers Undo for 14 days | Revert is under More actions (also in the file's right-click menu) |
| 9 | Switch stream | Streams in the rail, Switch on a row; open files are parked and the preview says so | stream type names (mainline, virtual) are Perforce words; each has a one-line explanation |
| 10 | History and time-lapse | History is in the right panel; time-lapse is under More actions | Time-lapse and Revision graph are not on the surface |
| 11 | Open a 3D model | View in 3D opens the full-window workspace; Alt-drag turns, F frames | an Unreal asset shows only its saved thumbnail, by design |
| 12 | Recover from offline | a calm band says what is saved and when it retries; Try now | the saved copy is only as fresh as the last connection |

Expert tour (five minutes): connect; open the palette (Ctrl+Shift+P); switch Artist and Full; Get latest preview; open a conflict and the Resolve menu; Submit with blockers; the Doctor (Checks and Caches); Settings; a 3D model.

What to look for: any word you had to read twice; any button that looks clickable and is not (or the reverse); any place where the next step is not obvious; any screen that looks different from its neighbours for no reason; any native-looking control (a system drop-down, scrollbar, resize grip or tooltip).
