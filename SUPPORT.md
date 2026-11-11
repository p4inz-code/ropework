# Support

Support during the beta is best effort, and no reply time is promised. A support email address will be added later. For now, the issue tracker is the place to ask.

## Ask or report a problem

[Open an issue](https://github.com/p4inz-code/ropework/issues/new/choose) and pick the template that fits: something broke, something was confusing, or you have an idea. Please do not post passwords, server addresses or private file names.

## What to include

The Ropework version (Help, About), the version of your Perforce server, what you did and what you expected. In the app, Help, Send feedback builds a short text with the version and the commands that ran recently. It has no file names, server addresses or passwords, and you can read it before you copy it.

## Questions that come up

**Windows says it protected my PC.** The installers are not code-signed yet. Check the checksum on the release, then choose More info and Run anyway.

**Ropework cannot find p4.** Ropework uses the free `p4` command-line client from Perforce and does not ship it. The first start tells you where it looked and lets you type the path.

**Do I need a licence key?** No. The beta is free and never blocks anything. A key, if you enter one, is only recorded on your computer.

**I reverted something by mistake.** Ropework saves a copy before a revert, a delete, a resolve or a forced get latest, and keeps it for 14 days. Use File, Safety copies, or Undo in the notification.

**The server is not reachable.** A band at the top says so. You can still read folders you opened before, from the saved copy, and Ropework retries by itself.

## Security problems

Please do not open a public issue. Read [SECURITY.md](SECURITY.md) and report it privately.

## Before you write

Look at the [known issues](https://p4inz-code.github.io/ropework/known-issues/). Yours may already be listed with a way around it.
