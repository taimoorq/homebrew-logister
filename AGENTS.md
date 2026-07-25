# Logister Homebrew Tap Agent Notes

This public tap wraps the canonical `logister-cli` npm artifact. It is not an
independent source release. Never commit registry credentials or local package
manager state.

## Update contract

- Do not update `Formula/logister.rb` until the exact CLI version is publicly
  visible on npm.
- The formula URL must point to the versioned npm tarball and `sha256` must be
  computed from those downloaded bytes, never copied from an unverified PR.
- Prefer running `npm run update:package-managers` from the sibling
  `logister-cli` repository; it updates Homebrew and Scoop from the same npm
  tarball.
- Keep `LOGISTER_INSTALL_SOURCE=homebrew`, the Node dependency, license,
  homepage, and formula test intact.
- Keep GitHub Actions Dependabot enabled and pin Actions to full commit SHAs.

## Verification

Run before merge:

```bash
ruby -c Formula/logister.rb
brew style Formula/logister.rb
url="$(ruby -ne 'puts $1 if /^\s*url\s+"([^"]+)"/' Formula/logister.rb)"
sha256="$(ruby -ne 'puts $1 if /^\s*sha256\s+"([a-f0-9]+)"/' Formula/logister.rb)"
archive="$(mktemp)"
trap 'rm -f "$archive"' EXIT
curl --fail --silent --show-error --location "$url" --output "$archive"
echo "$sha256  $archive" | shasum -a 256 --check
```

Merge the formula PR only after the matching npm and GitHub CLI releases exist.
