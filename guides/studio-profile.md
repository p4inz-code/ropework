# Studio profile (format v1)

A studio profile is one JSON file you give your people. Load it from **Studio profile** in the command palette (a file path, or paste the text). It is read whole or refused whole.

```json
{
  "format": "ropework-profile",
  "version": 1,
  "name": "Northlight Games",
  "description": "Rules for the art team",
  "locks": {
    "view.theme": { "value": "light", "reason": "Studio standard: the wall screens are light" },
    "view.zoom": { "value": 1.1, "reason": "Readable from the second desk row" }
  },
  "role": { "layout": "artist", "locked": true },
  "submit": {
    "template": "ART-000: \n",
    "rules": [
      { "kind": "starts_with_shape", "shape": "AAA-999", "message": "Start the description with a ticket like ART-123." },
      { "kind": "min_length", "n": 14, "message": "Say a little more about the change." },
      { "kind": "first_line_max", "n": 72, "message": "Keep the first line short." },
      { "kind": "contains", "text": "QA:", "message": "Add a QA line." }
    ]
  }
}
```

- **locks:** setting id (see Preferences) to a value (text, number or yes/no) and a reason people can read. Locked settings cannot be changed by the person.
- **role:** the starting layout, `artist` or `full`; `locked` fixes it.
- **submit.template:** what an empty description starts with.
- **submit.rules:** `starts_with_shape` (`A` = a letter, `9` = a digit, anything else must match itself; a backslash makes the next character literal, so `\\A9-` means a capital A, a 9 and a dash), `contains`, `min_length`, `first_line_max`. No patterns: the checks are always fast.
- Limits: 256 KB, 200 locks, 20 rules. Unknown keys are refused.
- The rules are checked in Ropework before submitting. The server does not enforce them; a server trigger is the way to enforce a rule for everyone.
