# Changelog

What each Ropework release changed, newest first. The same text is shown in the app (Help, What's new) and on the website.

## 0.27.0 (2026-11-11)

- **New:** Release candidate 1: the build to test by hand, after a screen-by-screen design review, an accessibility and copy review, a design-system audit and a security and error-handling pass
- **New:** Running commands show in Activity after a moment with a Cancel button; cancelling stops the work and the program it started at once
- **New:** A failed action after connecting always says so, with Copy details for the exact code and the server's words
- **Fixed:** A panic in one request or task can no longer end the app or freeze the queue; writes have a four-hour deadline; a failed connection never replaces a working one; a server cannot move the workspace folder in the middle of a session; a profile file on a network share is refused
- **Fixed:** Text areas show no system resize grip; controls such as the connection chip and filter chips have a border that meets the 3:1 contrast rule; Settings no longer truncates in the rail; the file panel scrolls; a blocked button says why on screen; History is one click away; the status bar no longer says connected while offline
- **Known:** Still open from the design review: the Full layout's Work pane, file tabs, Owner column and the Preview and Jobs tabs; the 3D toolbar, tool rail and timeline; the Doctor's Repair page; the right pane in Pending, Streams and Spaces; arrow keys in a context menu also move the file selection

## 0.26.0 (2026-11-11)

- **New:** Settings sits at the bottom of the side rail, and the connection chip shows the server version, as in the design
- **New:** The Activity panel's sample content shows real entries (submit, shelve, get latest) so it can be reviewed like the other screens
- **Known:** The Full layout is still about 15 percent different from the design pictures: the Work pane with its counts, file tabs, an Owner column and the Preview and Jobs tabs are not built
- **Known:** This is the last release before the release candidate; the migration kit and the legal documents move after it

## 0.25.0 (2026-11-11)

- **Fixed:** The app now really uses the design's typeface (Inter, with JetBrains Mono for paths and server names); it had been falling back to the system font because of a name mismatch
- **New:** The 3D view is a full-window, read-only workspace: the model fills the window, Statistics come first on the right, a readout shows the file, size and triangle count over the model, and the status line lists the mouse controls
- **New:** Closer to the design in the main window: white toolbar and panel headers, small-radius server and workspace chips in the mono face, separate key caps (Ctrl, Shift, P), small triangles in the folder tree, folder names in the mono face, spaced breadcrumb, grey filter chips
- **New:** The website has working download links (the release files are attached to a release in the public repository) and no form that is not connected
- **Known:** The design's 3D toolbar, tool rail, camera bookmarks and timeline are not built yet; the controls are in the right panel

## 0.24.0 (2026-11-11)

- **New:** Every dialog now has the design's frame: a close button, a tinted footer bar, centred on the window, and the width of the mockups
- **New:** Get latest shows four tiles (new, updated, will need resolving, to download), names the files that will need a resolve before you start, lists files from the stream root with icons, and says how old the preview is
- **New:** The Doctor has Checks (with summary tiles), Caches (the real size of the saved folder lists, opened copies and safety copies, and a way to clear them; safety copies are unticked and ask first) and a Support bundle that copies words only
- **Fixed:** A dialog opens with focus on its first real control, not on the close button
- **Known:** The design shows the Doctor as a separate window with a Repair page; here it is a dialog and the Repair step is the same as clearing the saved folder lists

## 0.23.0 (2026-11-10)

- **New:** The main window follows the design mockups more closely: folders have icons and file counts and the tree starts at the first folder with a choice in it, the toolbar has larger Get latest and Submit buttons, and Edit, Files, Workspace and Tools menus join File, View and Help
- **New:** A calm amber strip above the folders says how many files changed outside the app, with Review next to it
- **New:** The file panel shows the next step: a file that needs a resolve gets one callout with one Resolve button, and the rarer actions sit under More actions
- **Fixed:** Tables keep their column headings at the top and lined up with their columns; the status bar lists the server, version and workspace as the design does
- **Known:** The main window is still about 17 percent different from the design pictures (it was 21); the dialogs, the Doctor and the licence screens follow in the next releases

## 0.22.0 (2026-11-10)

- **Fixed:** Two security fixes found by the test sweep: the zip reader behind the Word, Excel and PowerPoint view could loop forever on a crafted file, and the bundled SQLite (the saved-copy database) is now the patched version
- **New:** Audio and video previews use Ropework's own player (play and pause, a seek bar, the time, mute) instead of the system's controls
- **New:** The 3D panel is simpler: quality, tools and animation stay in view, and Look, Compare and the model's details fold away until you open them
- **New:** Nothing native, nothing default: every tooltip in the app is drawn by Ropework (not the system's bubble), the open-and-close sections are Ropework's own, the document viewer draws its own scrollbars, and the Quality buttons in the 3D view share the row evenly instead of leaving an empty stretched cell; the build now fails if a system control or scrollbar is added
- **New:** Hover a server or workspace chip in the top bar to see what it is; the Activity panel starts smaller until something runs
- **New:** The 3D preview moves like Maya: left drag turns, middle drag pans, right drag or the wheel zooms, F frames the model
- **Fixed:** A review of the whole code found and fixed: a server address that could start a program, files that could be overwritten by a forced get latest, a delete or an automatic merge without a safety copy, 3D files that could crash the app, a busy button that could be pressed twice, and an audit trail that was never switched on
- **Known:** This release was prepared for the release-candidate test round; a manual test checklist for testers and the website is in the docs

## 0.21.0 (2026-11-09)

- **Fixed:** Working offline now reaches the folder screen: when the server cannot be reached a folder you looked at before shows its saved list, with a clear note that it is the saved copy, instead of an empty folder and an error
- **Fixed:** The tour no longer steps when you press the arrow keys in a text field; a studio profile's starting layout no longer overrides your own choice on every start unless the studio fixes it; the submit description you are typing is no longer lost when the list refreshes; description shapes can now require a literal A or 9 (use a backslash)
- **Known:** Files shown from the saved copy have no state and no size until the server is back

## 0.20.0 (2026-11-09)

- **New:** History is real now: the newest submitted changes, one per row with the first line, who and how long ago, a filter, and the files of the change you choose. Before, that rail item opened a leftover connect form
- **New:** Every screen without a folder tree says in two plain sentences what it is for (Open work, Spaces, History), instead of a placeholder; an empty Open work says what to do
- **New:** Plainer words: Pending changelists is now Open work

## 0.19.0 (2026-11-09)

- **New:** A 5-minute tour: seven short stops with a ring around what each one talks about (your files, Get latest, Submit, Artist or Full, search, and where your work is kept). It starts once by itself and is always in Help, Take the 5-minute tour, and in the command palette
- **New:** Calmer and clearer: the two actions above the file list are real buttons with icons and plain names (Find outside edits, Compare folders) and only appear in the Full layout, so Artist stays simple; a button that cannot run yet looks calm instead of broken, and still says why
- **New:** The rail item that was called Work is now called Spaces

## 0.18.0 (2026-11-09)

- **Fixed:** When the Perforce client could not reach the server, Ropework treated it as an empty answer: a folder looked empty and the saved copy of it was overwritten with nothing. It is now an error ("The server could not be reached"), the saved copy stays, and the Not connected band appears with Try now
- **New:** Working offline is tested end to end: a folder you looked at stays available from the saved copy while the server is away, the live ask fails quickly and plainly, and the same screen works again when the server is back, with no restart
- **New:** Speed budgets: large folders (100,000 files), large server replies (200,000 records), big stream trees, graphs, time-lapse, descriptions and Office files are measured on every build, so an accident that makes something ten times slower is caught
- **Known:** Editing files while offline and syncing the changes when the server is back (queued changes) is not built; offline today means browsing what was saved and keeping local files untouched

## 0.17.0 (2026-11-09)

- **New:** Studio profiles: a studio can share one small file that locks settings (each with a reason people can read in Preferences), sets the starting layout (and can fix it), fills in the submit description, and sets rules a description must meet before you can submit; load it from a file or paste it under Studio profile in the command palette
- **New:** A profile is read whole or refused whole, with a plain message; it never runs anything, and its description rules are plain checks, never patterns, so they cannot be slow
- **Known:** Profile rules are checked in Ropework before you submit; the server does not enforce them. Columns, saved views and menus in a profile, signed profiles and sharing a profile from the depot are not built yet

## 0.16.0 (2026-11-09)

- **New:** Time-lapse: step through the revisions of a text file with a slider and see the file as it was then, each line with the revision that wrote it, a bar that is lighter the older the line is, and the age in words; Changes between shows only what was written after a chosen revision; the left column can show revision, date or changelist
- **New:** PDF viewer: a Pages panel with thumbnails, an Outline panel with the PDF's own headings, and Fit the whole page
- **Fixed:** Zoomed-out PDFs left pages blank when many were on screen; long PDFs open at once instead of after every page has been read; Find counts and marks matches the same way; text boxes in Word files no longer swallow the text around them; a damaged Word file can no longer freeze the viewer
- **Fixed:** A new stream is made in the same stream depot as its parent; a stream switch only falls back to the server's own download when the server says it does not know the no-download option

## 0.15.0 (2026-11-09)

- **New:** Revision graph: choose a file and open its graph to see every revision, and the files it was branched, merged or copied with, joined by dashed links; each kind has its own shape, arrow keys move between revisions, and the List view shows the same history as a table
- **New:** Stream graph: the streams as boxes joined to their parents, with Fit, zoom and keyboard movement
- **New:** Copy up and merge down: choose a stream in the graph to see how many files would move, then do it; the files are opened in your workspace and nothing is submitted until you say so, your open files are saved first, and if your workspace is on the wrong stream you are offered the switch
- **New:** Edit a stream's description, options and paths, and make new development, release, task and virtual streams; a stream can never be moved under another parent from this screen
- **Known:** The time-lapse view (S13) and the extra PDF viewer panels (thumbnails, outline) move to 0.16.0; merge down that finds conflicts leaves the files to resolve from Pending

## 0.14.0 (2026-11-09)

- **New:** Streams: see every stream of the depot as a tree or a list with filters by kind (mainline, development, release, task, virtual), each with its own shape and a badge, and its details, paths and workspaces on the right
- **New:** Switch your workspace to another stream with everything shown first: how many open files will be saved and parked on the server, how much will be downloaded, and what comes back when you switch back; a safety copy of your open files is made before anything changes, and the switch is checked afterwards
- **New:** PDF viewer: pages with zoom, page buttons and find, drawn in a sandbox that has no network, no storage and no way to reach the rest of the app; password-locked PDFs are not opened
- **New:** Approximate view of Word, Excel and PowerPoint files (.docx, .xlsx, .pptx): the text, tables, sheets and slide text, with a note that layout and pictures are not shown; nothing in the file is ever run
- **Known:** The revision graph and the time-lapse view move to 0.15.0 so they share one graph with the streams graph; older Office files (.doc, .xls, .ppt) are not shown
- **Known:** On the oldest servers that do not know the no-download switch option, the server does the download itself and the guarded download is skipped; the open files are still saved first

## 0.13.2 (2026-11-09)

- **New:** Drop-down lists, sliders, check boxes and radio buttons are all drawn by Ropework now, not by the operating system; the display list in the 3D view has group headings and greys out modes a model cannot use, with the reason
- **Fixed:** A version of a file that does not exist is reported as missing instead of opening as an empty file
- **Known:** The 3D view and Open in were checked end to end in the real window with a real server, Blender and Maya; Houdini and Unreal thumbnails are still not built

## 0.13.1 (2026-11-08)

- **New:** Blender and Maya files in the 3D view: .blend and Alembic (.abc) open through Blender, .ma and .mb through Maya, converted on a temporary copy so your file is never touched
- **New:** Open in: a read-only copy of any file opens in a program found on this computer (Photoshop, Substance Painter, Blender, Maya, Unreal Editor and more than a dozen others), so nothing you save there can change your file or the depot
- **New:** Programs are found by themselves in their usual places and through the list of installed programs; where one is installed somewhere unusual, you can set its path in Settings under Other programs
- **New:** 3D compare: put two versions of a model over each other with the older as a ghost and the changes in heat colours, or slide a divider between them, or flip between them, with the numbers that changed
- **Known:** Houdini conversion and Unreal asset thumbnails are not built; comparing works for models the viewer reads directly, not for Blender or Maya files

## 0.13.0 (2026-11-08)

- **New:** 3D view: open GLB, glTF, OBJ, FBX, STL, PLY and USD models in a safe separate viewer, with the model's textures, animation (play, scrub, clips) and bones
- **New:** Thirteen display modes (shaded, clay, wireframe, normals, matcap, UV grid, roughness, metalness and more), studio lighting, light direction, turntable, floor grid, bounding box, axes, up-axis choice and background
- **New:** Measure the distance between two points, save a picture, save a turntable clip, and look at each texture with its size and the texture detail of the model
- **New:** Models open at Low quality at once and sharpen to Mid by themselves; High asks first when the model is above the limits for your computer, which Ropework works out from your graphics hardware and which you can change in Settings
- **Known:** USD animation is not played yet, textures are found only in the same folder as the model, and Blender, Maya, Alembic, Open in and 3D compare come in 0.13.1

## 0.12.0 (2026-11-08)

- **New:** 3D previews: STL, OBJ, PLY, glTF and GLB models turn in the file panel (drag, arrow keys, zoom) with Low, Mid and High quality
- **New:** Compare folders: see which files changed, or exist on only one side, between two changes of a folder or against another folder
- **New:** A file that is not text now shows how two revisions differ: sizes and where they first differ
- **New:** Previews have a Low, Mid and High quality; a very large model is thinned out so it stays quick
- **Known:** FBX, 3D compare, Unreal thumbnails and preview companions are not built yet; a glTF that points at other files is never opened

## 0.11.0 (2026-11-08)

- **New:** Merge by hand: when both you and the server changed the same lines, a card for each clash shows both versions and you choose to keep yours, take theirs or keep both
- **New:** Changes that do not touch each other are joined for you; the merged file is saved only after every clash has a choice, and a safety copy of your file is taken first
- **New:** Files that are not text, or are too large, say so and offer keep mine or take theirs
- **Known:** Folder compare, picture and binary compare, the revision graph and the time-lapse view are not built yet and come in later releases

## 0.10.0 (2026-11-08)

- **New:** Resolve files that changed on the server while you were editing: merge automatically (only when the changes do not touch the same lines), keep your version, or take theirs after a safety copy
- **New:** A file that cannot be merged automatically is left exactly as it was, still waiting, with a message that says so
- **Known:** A merge editor for overlapping changes, folder and picture compare come in the next release

## 0.9.0 (2026-11-08)

- **Fixed:** A server that maps files outside your workspace folder can no longer make the app save, replace, remove or preview files there: the action stops with a clear message
- **Fixed:** Dialogs dim the window with the designed dark veil and keep the title bar usable
- **Known:** Usability round 1 with testers has not happened yet

## 0.8.0 (2026-11-08)

- **New:** Changes made outside Ropework: a button in the folder view finds files edited, added or deleted without telling the server and opens them all; nothing on your computer is touched
- **New:** Compare two revisions of a text file from its history: added and removed lines with line numbers and context
- **New:** Safety copies browser (File menu): see every copy taken before a risky action, and restore one
- **Known:** Comparing pictures and binary files, the workspace tree view and merge are not built yet

## 0.7.0 (2026-11-08)

- **New:** File history: every revision with who, when, what kind of change and the words used
- **New:** Who changed each line: the changelist that last wrote each line of the newest revision
- **Known:** Unreal asset thumbnails are not read yet; history shows the newest 100 revisions; compare and revision graph come later

## 0.6.0 (2026-11-08)

- **New:** Real previews: pictures (png, jpeg, gif, bmp, webp) show as thumbnails on the cards and larger in the details; text files show their first lines
- **New:** Short sound and video clips (up to 2.5 MB) play in the details
- **New:** Files you have not downloaded are previewed from the server when they are small enough (50 MB for pictures and text)
- **Known:** Longer clips, 3D models, PDFs and Unreal assets are not previewed yet

## 0.5.0 (2026-11-08)

- **New:** Under the hood: the app now asks version control for things through one neutral contract, with Perforce as the first back end, so other systems can be added later
- **Fixed:** A file's state could list old revisions as extra entries and miss that you had it locked; each file now shows once with its lock
- **Known:** Only Perforce is supported; the second back end is still being studied

## 0.4.0 (2026-11-08)

- **Fixed:** If going back to a checkpoint fails after your open files were put back, the message now says where the safety copy of your work is
- **Fixed:** Install, run and uninstall were checked from a clean folder: nothing is left behind
- **Known:** The installer adds Desktop and Start Menu shortcuts without asking; our own installer will ask

## 0.3.0 (2026-11-08)

- **New:** Submit: write the description, see what blocks the submit, and send it. The blockers are checked again just before sending
- **New:** A refused submit never loses work: your files wait in a numbered changelist, and the message says which one
- **New:** Checkpoints: save the work in a changelist on the server, and go back to it later with a safety copy of what you had open
- **Fixed:** The Pending list showed an error when nothing was checked out
- **Known:** Resolving conflicts, history and diff are not built yet

## 0.2.0 (2026-11-08)

- **New:** What's new, About and a Help menu
- **New:** Send feedback with a kind, attachments you can switch off, and a preview of the bundle
- **New:** The doctor in the Help menu: checks that the app can work on this computer
- **Fixed:** Dialogs now dim and soften the window under the title bar, as designed
- **Known:** The installer is the standard one; our own installer screens come later

## 0.1.0 (2026-11-08)

- **New:** Artist layout and Full layout, with the files of a folder as cards or rows and their state in words
- **New:** Get latest with a preview, check out, lock and unlock, delete, rename or move, revert with Undo
- **New:** Safety copies before anything that could lose your changes (kept 14 days)
- **New:** Register a key, send feedback, About, and ropework-doctor next to the app
- **Known:** Submit, shelve, history and diff are not built yet
- **Known:** Thumbnails are file-type icons until the preview releases
