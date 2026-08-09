class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "https://registry.npmjs.org/logister-cli/-/logister-cli-1.0.0.tgz"
  sha256 "090e44b31691926ee6ea29ee08bec87a744f3bcbedf140167ff15ae5a28a6326"
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
