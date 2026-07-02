class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "https://registry.npmjs.org/logister-cli/-/logister-cli-0.1.0.tgz"
  sha256 "fd7a3db83fd06ff633d31658dcd0effd7d409415c29788639eb0983049342b41"
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
