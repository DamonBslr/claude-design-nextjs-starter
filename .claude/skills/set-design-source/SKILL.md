---
name: set-design-source
description: >-
  Create or repair DESIGN_SOURCE.json, the git anchor used by incremental Claude
  Design sync. Use for /set-design-source, when claude-design-sync reports a
  missing or invalid anchor, or when the implemented UI matches an older import
  than the latest design-src commit. Validates the chosen import and writes only
  the anchor file.
---

# Set the design sync anchor

The anchor must name the import commit whose `design-src/` state the current UI
actually implements. Choosing the newest import blindly can hide unsynced work.

## Procedure

1. Confirm `packages/ui` exists and `design-src/MANIFEST.json` is present.
2. If `DESIGN_SOURCE.json` exists, show its current values and treat this as a
   repair. Preserve `last_sync_pr` unless the user explicitly resets it.
3. List import commits:

   ```bash
   git log --oneline -- design-src/
   ```

4. Accept an explicitly supplied commit or offer the newest import as a candidate.
   Ask the user to confirm that the current implemented UI matches it.
5. Resolve the full commit SHA and verify both that it exists and that the commit
   touches `design-src/`.
6. Read the manifest label at that commit with
   `git show <sha>:design-src/MANIFEST.json`.
7. Write only:

   ```json
   {
     "schema": 1,
     "source_label": "<label>",
     "synced_commit": "<full sha>",
     "synced_at": "<YYYY-MM-DD>",
     "last_sync_pr": null
   }
   ```

8. Show the file and run `bun run design:pending` to report pending imports.

Do not edit `design-src/`, application code, specs, schema, or auth. Do not stage or
commit the anchor automatically.
