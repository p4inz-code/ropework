# Test checklist

For anyone testing Ropework by hand. These are the things only a person can judge; every other check is automated.

**The bar:** an expert understands Ropework after a 5-minute tour. Apple and Notion level of care. If you hesitate for more than three seconds anywhere, write down where.

## 0. Setup
- [ ] Install from `Ropework Setup <version>.exe` on a clean Windows 11 account; then try the portable zip on another folder.
- [ ] A test server is running (a local p4d, or your studio's). Note its version.
- [ ] You have a few files of each kind: text, images, a 3D model (glb, fbx), a PDF, a Word and an Excel file.

## 1. First five minutes (do this with someone who has not seen it)
- [ ] First start: is it clear what Ropework needs (the `p4` client) and how to get it?
- [ ] Connect to the server. Is every word understandable? Any step you did not expect?
- [ ] The 5-minute tour starts by itself: seven stops, each with a ring on the right thing. Does it make sense? Can you leave it? Does Help, Take the 5-minute tour, reopen it?
- [ ] Without help: find a file, see its state, get latest, check out a file, edit it, submit. Count the hesitations.

## 2. Everyday work
- [ ] Depot tree and file list: Grid and List, filters (Mine, Locked, Needs resolve, Not downloaded). Are the state words right for every file?
- [ ] Artist layout versus Full layout: is Artist really simpler? Is anything missing that an artist needs, or still on screen that they do not?
- [ ] Get latest: the preview lists what will change; the numbers match the server; cancel works; you can keep working while it runs.
- [ ] Check out, lock, unlock, delete, move, revert (with the Undo in the notification).
- [ ] Submit: the description, the blockers, a blocked button says why; shelve, unshelve, checkpoint.
- [ ] Outside edits (Full layout): edit a file in another program; Find outside edits sees it and opens it for the server.
- [ ] Resolve a conflict three ways (auto, keep mine, take theirs) and by hand in the merge screen.

## 3. Looking at things
- [ ] History (rail): newest changes, filter, files of a change. Right-click a file for its own history; Revision graph; Time-lapse with the slider.
- [ ] Compare two versions of a text file and an image; Compare folders.
- [ ] 3D view: open a model, orbit, render modes, quality Low/Mid/High, measure, picture, animation (FBX), compare two versions. Open in another program.
- [ ] Document view: a PDF (pages, find, thumbnails, outline), a Word, Excel and PowerPoint file (approximate view says so).

## 4. Streams (needs a stream depot)
- [ ] Streams screen: tree, graph, list; kinds have shapes and words.
- [ ] Switch workspace to another stream: the dialog shows what will happen; open files are saved first; switching back restores them.
- [ ] Copy up and merge down from the graph; the "switch first" help when the workspace is on the wrong stream.
- [ ] Edit a stream; make a new task or development stream.

## 5. Studio and safety
- [ ] Studio profile (palette, Studio profile): load the sample from `guides/studio-profile.md`; locks show their reason in Preferences; the layout is fixed; the submit window starts from the template and blocks a description that breaks a rule.
- [ ] Offline: stop the server (or pull the network). The band says so; a folder you looked at shows its saved copy with a note; start the server; it recovers without a restart.
- [ ] Safety copies: after a revert or a forced get latest, restore from the safety dialog.
- [ ] Licence: register with a beta key; feedback bundle; Help, Health (doctor).

## 6. Quality of feel
- [ ] Keyboard only: tab through the main screen, open the palette (Ctrl+Shift+P), run commands, close dialogs with Escape.
- [ ] 200 percent zoom; the smallest window; dark and light; density compact and spacious.
- [ ] Windows high contrast mode. A screen reader on one screen (Narrator): do the file list and the submit window read sensibly?
- [ ] Motion feels calm; nothing jumps; nothing flashes; reduced motion setting is respected.
- [ ] Every error you can cause (wrong password, wrong server, a locked file): is the message plain, and does it say what to do?
- [ ] Uninstall: the app goes, your files and the safety copies are as you want.

## How to report what you find
- In the app: Help, Send feedback builds a short text with the version and what ran recently (no file names, server addresses or passwords). Paste it into an issue: https://github.com/p4inz-code/ropework/issues
- Say what you did, what you expected and what happened. A screenshot helps. Note where you hesitated for more than three seconds.
