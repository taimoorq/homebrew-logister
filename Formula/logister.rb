class Logister < Formula
  desc "Command-line access to Logister project telemetry for humans and AI tools"
  homepage "https://github.com/taimoorq/logister-cli"
  url "https://registry.npmjs.org/logister-cli/-/logister-cli-1.1.0.tgz"
  sha256 "abadbe4fc4bc60b911ae71665b889c0f4742a47cb62d00a382b9413257d88f56"
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
