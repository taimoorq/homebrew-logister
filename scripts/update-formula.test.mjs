import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import assert from "node:assert/strict";

const script = new URL("./update-formula.mjs", import.meta.url).pathname;
const workdir = mkdtempSync(join(tmpdir(), "update-formula-test-"));
const output = join(workdir, "logister.rb");
const sha256 = "a".repeat(64);
const canonicalUrl = "https://registry.npmjs.org/logister-cli/-/logister-cli-1.2.3.tgz";

after(() => rmSync(workdir, { recursive: true, force: true }));

function run(...args) {
  rmSync(output, { force: true });
  return spawnSync(process.execPath, [script, "--output", output, ...args], { encoding: "utf8" });
}

function assertRejected(result, pattern) {
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stderr, pattern);
  assert.throws(() => readFileSync(output), { code: "ENOENT" });
}

test("writes the canonical npm URL by default", () => {
  const result = run("--version", "1.2.3", "--sha256", sha256);
  assert.equal(result.status, 0, result.stderr);
  const formula = readFileSync(output, "utf8");
  assert.match(formula, new RegExp(`url "${canonicalUrl}"`));
  assert.match(formula, new RegExp(`sha256 "${sha256}"`));
  assert.match(formula, /LOGISTER_INSTALL_SOURCE: "homebrew"/);
});

test("accepts an explicit --url equal to the canonical npm URL", () => {
  const result = run("--version", "1.2.3", "--sha256", sha256, "--url", canonicalUrl);
  assert.equal(result.status, 0, result.stderr);
});

test("accepts prerelease versions", () => {
  const result = run("--version", "1.2.3-rc.1", "--sha256", sha256);
  assert.equal(result.status, 0, result.stderr);
});

for (const url of [
  "https://example.com/logister-cli-1.2.3.tgz",
  "http://registry.npmjs.org/logister-cli/-/logister-cli-1.2.3.tgz",
  "https://registry.npmjs.org/logister-cli/-/logister-cli-1.2.4.tgz",
  "https://registry.npmjs.org/other/-/logister-cli-1.2.3.tgz",
  `${canonicalUrl}?x=1`,
]) {
  test(`rejects non-canonical --url ${url}`, () => {
    assertRejected(run("--version", "1.2.3", "--sha256", sha256, "--url", url), /Invalid --url/);
  });
}

for (const value of ["A".repeat(64), "a".repeat(63), "a".repeat(65), `${"a".repeat(63)}g`, `${"a".repeat(64)}"`]) {
  test(`rejects malformed --sha256 ${value}`, () => {
    assertRejected(run("--version", "1.2.3", "--sha256", value), /Invalid --sha256/);
  });
}

for (const value of ["1.2", "v1.2.3", "01.2.3", "1.2.3+build", '1.2.3"', "1.2.3/../x"]) {
  test(`rejects malformed --version ${value}`, () => {
    assertRejected(run("--version", value, "--sha256", sha256), /Invalid --version/);
  });
}

test("rejects missing --sha256", () => {
  assertRejected(run("--version", "1.2.3"), /Missing --sha256/);
});
