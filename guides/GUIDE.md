# Ropework guide

This guide is for people who have never opened Ropework, for artists who have never used Perforce, and for testers who want to know what to try. Read it top to bottom once, or jump to the part you need. The questions people ask most are near the end.

## What Ropework is

Ropework is a desktop app for working with a Perforce Helix Core server, the kind many game and VFX studios keep their files on. It does the things P4V does: get the newest files, check files out, submit your work, look at history, resolve clashes. It tries to do them in plain words, and to tell you why something is blocked instead of just greying it out.

It has two layouts in one window. Artist is the simple one: big thumbnails and two buttons. Full adds the folder tree, a details panel and the command log, for people who want every detail. You can switch at any time.

Ropework does not replace your server. It talks to the same server and the same workspaces you already use, so you can run it next to P4V while you decide.

## Before you start

You need three things.

- Windows 11, 64-bit. A Linux build is planned but is not part of the beta.
- The free Perforce command-line client, `p4`. Ropework does not ship it. If it is missing, the first screen says where to get it.
- A Perforce server you are allowed to use, either your studio's or a test one.

If you only want to look around, ask your studio admin for a test server, or set up a small local one. Please do not point a beta at a server you cannot afford to be careful on.

## Install

There are two downloads on the [releases page](https://github.com/p4inz-code/ropework/releases).

The installer, `Ropework-Setup-<version>.exe`, installs for your user only and needs no administrator rights. Remove it later from Windows, Installed apps.

The portable zip, `ropework-<version>-win-x64-portable.zip`, can be unzipped anywhere. Run `Ropework.exe`. To remove it, delete the folder.

The files are not code-signed yet, so Windows may say it protected your PC. Choose More info, then Run anyway. If you want to be sure the file is the one we published, compare its checksum with the `SHA256SUMS.txt` on the same release. In PowerShell:

```bash
Get-FileHash .\Ropework-Setup-0.27.0.exe -Algorithm SHA256
```

The two values should match exactly.

## First start

The welcome screens do three things. They look for `p4` and tell you where they looked. They ask for your server and your user name, and sign you in. Then they list your workspaces and ask which one to open and whether you want the Artist or the Full layout.

You will not be asked to type a password into Ropework's own files. The p4 client keeps its ticket, and anything else that has to be remembered goes into the Windows key store.

After that you land in the main window. If you get lost, Help, Take the 5-minute tour walks through the screen with short notes.

## Finding your way around

The narrow bar on the left is the rail. It has Depot, Pending, History, Streams and Spaces, and Settings at the bottom. Depot is the files. Pending is the work you have open. History is what other people submitted. Streams are the branches of your project. Spaces are your workspaces.

At the top, the Find box looks for a file, a change or a command. Press Ctrl+Shift+P to open it from anywhere. Every action in Ropework is in that list, so if you cannot find a button, type its name.

The menus are File, Edit, Files, Workspace, Tools and Help. Tools holds "Files changed outside the app" and "Compare folders". Help holds the tour, What's new, the doctor and Send feedback.

The status bar at the bottom says which server you are on and whether it is reachable.

## The words, in plain terms

Perforce has its own vocabulary. Here is what it means in Ropework.

- Depot: the server's store of files and folders.
- Workspace: the folder on your computer that mirrors part of the depot. Ropework calls the list of them Spaces.
- Get latest: bring the newest versions from the server into your workspace.
- Check out: tell the server you are about to change a file. It makes the file writable and lets others see you have it.
- Lock: stop other people from checking the file out while you work. Use it for files that cannot be merged, such as most art files.
- Changelist, or change: a bundle of files you are working on together. Pending ones are not submitted yet.
- Submit: send your changes to the server so others can get them.
- Revert: give up your changes to a file and bring back the server's copy.
- Resolve: when your change and someone else's touch the same file, decide which version wins, or combine them.
- Stream: a branch with rules about how work flows between it and its parent.
- Shelve: park your open changes on the server without submitting them.
- Checkpoint: Ropework's one-click version of a shelve. It saves your open work to the server so you can go back to it.

## Everyday work

### See what state a file is in

Every file says its state in words: edited by you, locked by someone, not at latest, needs a resolve. The same words show on the card or row and in the right-hand panel, along with an icon, so you never have to read a state from colour alone. If a file is locked, the panel names who has it.

### Get the newest files

Choose Get latest. Before anything changes, Ropework shows a preview: how many files are new, how many will be updated, how many will be removed, their total size, and which ones will need a resolve. Read it, then confirm.

If you changed a file without checking it out, Get latest will not overwrite it unless you tick the box that says so. Even then, it saves a safety copy first.

### Check out and lock

Select a file and choose Check out. Choose Lock as well if the file cannot be merged. If a button is blocked, the reason is written under it, for example that the file needs a resolve first.

### Rename, move, delete and revert

These are in the Files menu and in the right-click menu of a file. Anything that could lose your changes shows what will happen, saves a safety copy, and offers Undo afterwards.

### Safety copies and Undo

Before a revert, a delete, a resolve or a forced Get latest, Ropework keeps a copy of what you had. It keeps it for 14 days. After the action, a notice offers Undo. You can also open File, Safety copies at any time.

Clearing the saved data in the doctor does not touch safety copies unless you tick them on purpose. The box is unticked by default.

### Resolve a clash

When a file needs a resolve, the panel has one button, Resolve, and a short menu. You can merge automatically, keep your version, take theirs, or go through the clashes one by one. The recommended choice comes first. Taking theirs asks for a confirmation and keeps a safety copy.

If a file is binary, such as a texture or a scene, Ropework cannot merge it. You pick one version.

### Submit

Choose Submit when you are ready to send work to the server. If something stops it, Submit lists the reasons, and each reason has its own fix. A studio can add rules, for example that every description must contain a ticket number.

### Save a checkpoint

A checkpoint saves your open work to the server without submitting it. Use it before a risky change, or at the end of the day. Choose Save checkpoint in Pending. Go back to checkpoint brings the work back.

### Changes made outside Ropework

If you edited files in another program without checking them out, Tools, Files changed outside the app finds them and offers to check them out or to put them back.

## Looking at history

Open a file and look at History in the right-hand panel. It lists every revision, who made it and when, and lets you compare two.

Time-lapse shows who last changed each line of a file, with a slider to step through its revisions. It is under More actions.

The revision graph draws branches and merges as a graph, with a list view and a legend. Each kind of node has its own shape, so you do not need colour to read it.

Compare folders, under Tools, shows which files differ between two changes of a folder.

## Streams

If your project uses streams, open Streams in the rail. Each stream type is explained in one line. Double-click a stream, or choose Switch on its row, to move your workspace to it. Files you have open are parked first, and the preview says so.

To bring work from a parent stream into yours, or the other way, Ropework shows how many files will merge and how many need a resolve. Then open Pending to resolve and submit.

## Previews and 3D models

Select a picture, a text file, an audio file or a video and it previews on the right. The preview is read-only. It cannot change your file.

For a 3D model, choose Open 3D view. It opens a full-window workspace that reads glTF, FBX, OBJ, STL, PLY and USD, and Blender and Maya files too if those programs are installed. It moves like Maya: left drag turns, middle drag pans, right drag or the wheel zooms, and F frames the model. You can compare two versions, measure and save a picture. Statistics are on the right.

An Unreal asset shows only its saved thumbnail. That is on purpose for now.

Files that other people made open in a sandbox with no network and no storage, so a bad file cannot reach out of it.

## When something goes wrong

### The server is not reachable

A calm band at the top says so, says what is saved and when Ropework will try again. You can still read folders you opened before, from the saved copy. Choose Try now to retry at once. The saved copy is only as fresh as the last time you were connected.

### Something looks broken

Help, Run the doctor. It has three parts. Checks tells you whether everything the app needs is in place. Caches shows how much saved data there is and lets you clear it. Support bundle builds a short text you can copy.

### Tell us

Help, Send feedback builds a short text with the version and the names of the commands that ran recently. It has no file names, server addresses or passwords. You read it before anything is shared, and nothing is sent unless you copy it into an issue yourself.

## For studio admins

A studio profile is a small file that shares settings with everyone: which layout people get, rules for descriptions, and similar. The [studio profile guide](studio-profile.md) describes the format. If your studio fixes the layout, the switch says so.

## For testers

Thank you for helping. The beta is free and needs no key.

### What to try first

- Connect, find a file, and read its state and lock.
- Get latest with the preview, then check out a file, change it and revert it, then use Undo.
- Submit a change, and try one that is blocked to see the reasons.
- Open a conflict and look at the Resolve menu.
- Look at a file's history and its time-lapse.
- Open a 3D model.
- Unplug the network and see how Ropework behaves.
- Run the doctor.

The [usability walk](usability-walk.md) turns this into twelve timed tasks. The [test checklist](test-checklist.md) is a longer list.

### What we most want to hear

Any word you had to read twice. Any button that looks clickable and is not, or the other way round. Any place where you did not know the next step. Any screen that looks different from the ones next to it for no reason. Any control that looks like it belongs to Windows instead of Ropework. And anything that felt slow.

### How to report it

[Open an issue](https://github.com/p4inz-code/ropework/issues/new/choose) and choose the template that fits. Say what you did, what you expected and what happened, and paste the text from Send feedback. Please do not post passwords, server addresses or private file names. For a security problem, read [SECURITY.md](../SECURITY.md) and report it privately.

### What is still to come

The current list is on the [known issues page](https://p4inz-code.github.io/ropework/known-issues/). It is generated from one status file that is checked at every release, so it is the place to look. This guide does not repeat it, because a copy would go out of date.

## Questions people ask

### Do I need to stop using P4V?

No. Ropework uses the same server and the same workspaces. Use both side by side and switch when you are ready. Nothing on your server changes.

### Is it free?

The beta is free and needs no key. Prices for after the beta are on the [pricing page](https://p4inz-code.github.io/ropework/pricing/). They are flat per studio, by the number of people.

### Is my data safe?

Your files and server details stay on your network. Ropework sends no telemetry and has no analytics. It never stores a password. It saves a copy before anything destructive. The [privacy page](https://p4inz-code.github.io/ropework/privacy/) has the details.

### Windows says it protected my PC. Is the file safe?

The installers are not code-signed yet, which is what triggers the warning. Compare the file's SHA-256 checksum with `SHA256SUMS.txt` on the release. If they match, it is the file we published. Then choose More info and Run anyway.

### Ropework cannot find p4.

Install the free command-line client from Perforce, then restart Ropework. The first screen shows where it looked, and lets you type the full path to `p4.exe` if it lives somewhere unusual.

### Why is a button blocked?

Because something has to happen first, and the reason is written under the button. For example, Check out is blocked for a file that needs a resolve, and Get latest is blocked until you pick a folder. If you cannot see a reason, that is a bug. Please tell us.

### I reverted or deleted something by mistake.

Use Undo in the notice that appeared, or File, Safety copies. Copies are kept for 14 days.

### What is the difference between Artist and Full?

Artist shows big thumbnails and the two buttons most people need. Full adds the folder tree, the details panel and the command log. They show the same files from the same server. Switch with the Layout control.

### Can I use it with Unreal, Unity, Blender or Maya projects?

Ropework works with any files on a Perforce server. It previews many formats, and its 3D view reads common model formats plus Blender and Maya files when those programs are installed. It is not a plug-in for those programs.

### What happens when the server goes away?

A band says so. You can read the folders you opened before, from the saved copy, and Ropework retries on its own. Anything that needs the server waits until it is back.

### Will Ropework have its own Perforce client?

That is the plan, but it has not started. Today Ropework runs the free `p4` command-line client for every server command. Replacing it with a client of our own is a decided direction, and the layer it would plug into is already built. Research, a legal read and a schedule are still to do, and no code exists for it yet. The [known issues page](https://p4inz-code.github.io/ropework/known-issues/) shows its current state.

### Does it work on Linux or Mac?

Not yet. Ubuntu 24.04 is the next platform and is being prepared, but no build is published. A Mac build is not planned for the beta.

### How do I clear Ropework's saved data?

Help, Run the doctor, Caches. You can clear folder listings without touching anything else. Safety copies are separate and are unticked by default.

### Where does Ropework keep my settings?

In your user settings folder on your computer. The doctor shows how large the saved data is. Nothing is uploaded.

### How do I send feedback without leaking anything?

Help, Send feedback builds a text with the app version and recent command names. It has no file names, server addresses or passwords. You read it, and you decide whether to paste it into an issue.

### How do I report a security problem?

Privately. See [SECURITY.md](../SECURITY.md). Please do not open a public issue.

### Who makes Ropework?

P4inz Interactive Labs, an independent studio run by Atharva Patil. Ropework is not affiliated with Perforce Software. Perforce and Helix Core are trademarks of Perforce Software.
