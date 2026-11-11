# Privacy notice

This notice covers the Ropework desktop app and the Ropework website. It is a draft for the beta. Reviewed terms will replace it before the first public release.

## The app

Ropework sends no telemetry and has no analytics. It talks to the Perforce server you tell it to use, through the `p4` command-line client on your computer, and to nothing else, with one exception described below.

What stays on your computer:

- Your server address, user name and workspace list, in the app's settings folder.
- A saved copy of folder listings, so you can read them offline. You can see how large it is and clear it in Doctor, Caches.
- Safety copies of files, made before a revert, delete, resolve or forced get latest, kept for 14 days.
- Your choices: layout, theme and similar.

Passwords are never stored. The p4 client holds its own ticket, and anything else the app must remember goes into the operating system's key store.

The one exception: if you enter a licence key, the app contacts the licence service to confirm it. The beta needs no key, so this does not happen unless you choose to. The check sends the key and the app version, and nothing from your depot.

Send feedback builds a text on your screen with the app version and recent command names. It has no file names, server addresses or passwords. Nothing is sent. You decide whether to copy it into an issue.

Files made by other people, such as 3D models and documents, open in a sandbox with no network access and no storage.

## The website

The site sets no cookies and has no analytics, outside scripts or outside fonts. It keeps one thing in your browser's storage: your choice of light, dark or system theme. That never leaves your browser.

The site and the downloads are hosted by GitHub. GitHub receives your request when you open a page or download a file, and handles it under its own privacy terms.

## Issues

If you open an issue in this repository, GitHub stores what you write and your GitHub account name, and anyone can read them. Do not post passwords, server addresses or private file names.

## Contact

Open an issue at https://github.com/p4inz-code/ropework/issues. For a privacy request about something you posted, say so in the issue. A dedicated address will be added later.

P4inz Interactive Labs, Atharva Patil.
