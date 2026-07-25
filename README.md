# Homebrew Tap For Logister

This tap installs the [`logister` CLI](https://github.com/taimoorq/logister-cli) on macOS and Linux. The formula wraps the canonical `logister-cli` npm tarball and installs Node.js as a Homebrew dependency.

## Install

```bash
brew tap taimoorq/logister
brew install logister
```

The installed executable is:

```bash
logister version
logister help
```

Next, connect to your hosted or self-hosted Logister server:

```bash
logister auth login --host https://logister.example.com
logister doctor
logister projects list
```

`doctor` should show your CLI version, active profile, server version, and supported feature map without printing the token. See the [CLI README](https://github.com/taimoorq/logister-cli#readme) for project, event, log, and issue examples.

## Update

```bash
brew update
brew upgrade logister
```

To remove the CLI and tap:

```bash
brew uninstall logister
brew untap taimoorq/logister
```

## Maintainer Notes

This tap is a distribution repository, not an independent source release. Update it only after the matching `logister-cli` version is visible on npm. Prefer the coordinated updater from a workspace containing the CLI, Homebrew, and Scoop repositories:

```bash
cd ../logister-cli
npm run update:package-managers
```

To update only this formula, calculate the SHA256 from the downloaded npm tarball and run:

```bash
node scripts/update-formula.mjs \
  --version X.Y.Z \
  --sha256 <release-tarball-sha256>
```

The formula must use the same version and checksum as the npm registry tarball
`https://registry.npmjs.org/logister-cli/-/logister-cli-X.Y.Z.tgz`.

Validate the result before opening or merging a pull request:

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
