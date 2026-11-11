# Ropework beta: guide for testers

Thank you for trying Ropework. It is a desktop client for Perforce Helix Core that keeps you safe and tells you why things are blocked. This is an early beta: it does less than P4V today, and what it does, it tries to do carefully.

## What you need
- Windows 11 (64-bit). A Linux build is not part of this release.
- The free Perforce command-line client, `p4`, installed. If it is missing, the first screen tells you and shows where to get it. Ropework does not bundle it.
- A Perforce server you may use (your studio's, or a test one).

## Install (pick one)
1. **Portable:** unzip `ropework-<version>-win-x64-portable.zip` anywhere and run `Ropework.exe`. No administrator rights needed. To remove it, delete the folder.
2. **Installer:** run `Ropework Setup <version>.exe`. It installs for your user only. Remove it later from Windows "Installed apps".

Both are **not code-signed yet**, so Windows may say "Windows protected your PC". Choose **More info**, then **Run anyway**. Check that the file matches `SHA256SUMS.txt` first if you want to be sure it is the one you were sent (in PowerShell: `Get-FileHash <file>`).

## First minutes
1. The welcome screens find `p4`, connect you to your server, and ask how it should look.
2. Pick a folder on the left. Files show their state in words: edited by you, locked by someone, not at latest, and so on.
3. Try **Get latest** (it shows what will change first), **Check out**, **Lock**, **Rename or move**, **Delete** and **Revert**. Anything that could lose your changes saves a **safety copy** first, kept for 14 days, and offers **Undo**.
4. **File > Licence** is where the key from your invitation email goes. During the beta nothing is blocked whether or not you register.
5. **Help > Run the doctor** checks that everything the app needs is in place.

## What you can try now
- **Safe daily actions:** Get latest (with a preview), Check out, Lock, Rename or move, Delete and Revert. Anything that could lose your changes takes a safety copy first and can be undone for 14 days.
- **Submit and checkpoints:** a Submit that cannot run says why; a checkpoint saves your open work to the server and brings it back.
- **History:** a file's revisions, who last changed each line, and what changed between two versions.
- **Resolve and merge:** merge automatically, keep yours, take theirs, or choose for each clash by hand.
- **Previews:** pictures, text, audio and video. Select a model and choose **Open 3D view** (glTF, FBX, OBJ, STL, PLY, USD; Blender and Maya files too, if those programs are installed). Compare two versions, measure, and save a picture.
- **Open in:** a read-only copy of a file opens in a program found on your computer.
- **Changes made outside Ropework** are found and reconciled; **Compare...** shows which files differ between two changes of a folder.

## What is not built yet
Streams, the PDF viewer, studio profiles, extensions and the Review workspace; a Linux build; signed installers; Houdini files and Unreal thumbnails in the 3D view. Ropework still needs the free `p4` client; its own client is planned. **Help > What's new** lists what each release added.

## Telling us what happened
**Help > Send feedback** builds a short bundle on your computer. You see it before anything is sent, and nothing leaves your computer unless you choose to send it. Include what you did, what you expected and what happened.
