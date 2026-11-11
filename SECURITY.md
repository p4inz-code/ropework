# Security

## Reporting a problem
Please do **not** open a public issue for a security problem. Use GitHub's private reporting: the **Security** tab of this repository, then **Report a vulnerability**. Say what you found, which version, and how to repeat it. We aim to answer within a few working days.

## What Ropework does about security
Passwords are never stored; the app has no network port of its own; it sends no telemetry; files that other people made are shown in a sandbox with no network and no storage. The full description is on the [Privacy and security](https://p4inz-code.github.io/ropework/privacy/) page.

## Verify a download
Every release has a `SHA256SUMS.txt`. In PowerShell: `Get-FileHash <file> -Algorithm SHA256`, and compare. The installers are not code-signed yet, so Windows may warn; check the checksum first.
