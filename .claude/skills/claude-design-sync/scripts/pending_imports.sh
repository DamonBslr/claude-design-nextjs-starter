#!/usr/bin/env bash
set -euo pipefail

anchor_file="DESIGN_SOURCE.json"
design_dir="design-src"

[ -f "$anchor_file" ] || { echo "x $anchor_file missing; run /set-design-source" >&2; exit 1; }
[ -d "$design_dir" ] || { echo "x $design_dir missing; run /import-design" >&2; exit 1; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "x not in a git repository" >&2; exit 1; }

read_field() {
  local key="$1"
  if command -v jq >/dev/null 2>&1; then
    jq -r --arg key "$key" '.[$key] // empty' "$anchor_file"
  else
    sed -n "s/.*\"$key\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$anchor_file" | head -1
  fi
}

synced="$(read_field synced_commit)"
[ -n "$synced" ] || { echo "x synced_commit missing; run /set-design-source" >&2; exit 1; }
git cat-file -e "${synced}^{commit}" 2>/dev/null || { echo "x anchor commit not found: $synced" >&2; exit 1; }

latest="$(git log -1 --format=%H HEAD -- "$design_dir" || true)"
[ -n "$latest" ] || { echo "x no design import commits found" >&2; exit 1; }

count="$(git rev-list --count "${synced}..HEAD" -- "$design_dir")"
echo "anchor:  $(git rev-parse --short "$synced")"
echo "latest:  $(git rev-parse --short "$latest")"
echo "pending: $count"

if [ "$count" -eq 0 ]; then
  echo "ok design is up to date"
  exit 0
fi

git log --oneline --reverse "${synced}..HEAD" -- "$design_dir"
echo "next: /sync-design --to <sha> or /sync-design"
