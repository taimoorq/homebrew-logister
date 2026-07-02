class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "https://registry.npmjs.org/logister-cli/-/logister-cli-0.1.2.tgz"
  sha256 "837a72c4c4c8c3afa2287b1bfd49aa86ce3c8ff96f57497312bedc3b7ddca461"
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
