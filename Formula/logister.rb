class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "https://registry.npmjs.org/logister-cli/-/logister-cli-1.3.0.tgz"
  sha256 "550d9f9eb84d890076e243a3c46c77a7008293cc0dd21d65fae5089828f1f56d"
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
