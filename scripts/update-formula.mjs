#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));
const version = required(args.version, "--version");
const sha256 = required(args.sha256, "--sha256");
const url = args.url || `https://registry.npmjs.org/logister-cli/-/logister-cli-${version}.tgz`;
const output = resolve(args.output || "Formula/logister.rb");

const formula = `class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "${url}"
  sha256 "${sha256}"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    (bin/"logister").write_env_script libexec/"bin/logister", LOGISTER_INSTALL_SOURCE: "homebrew"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/logister version")
  end
end
`;

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, formula);
process.stdout.write(`updated ${output}\n`);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    parsed[key.slice(2)] = value;
    index += 1;
  }
  return parsed;
}

function required(value, name) {
  if (!value) {
    process.stderr.write(`Missing ${name}\n`);
    process.exit(2);
  }
  return value;
}
