# Homebrew Tap For Logister

This tap distributes the Logister CLI for macOS and Linuxbrew users.

## Install

```bash
brew tap taimoorq/logister
brew install logister
```

The installed executable is:

```bash
logister version
```

## Update

```bash
brew update
brew upgrade logister
```

## Maintainer Notes

Release updates are generated from the published `logister-cli` npm tarball:

```bash
node scripts/update-formula.mjs \
  --version 0.1.0 \
  --sha256 <release-tarball-sha256>
```

The formula must use the same version and checksum as the npm registry tarball
`https://registry.npmjs.org/logister-cli/-/logister-cli-X.Y.Z.tgz`.
