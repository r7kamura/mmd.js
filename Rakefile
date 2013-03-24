require "webrick"
require "launchy"

desc "Start server on localhost:8080"
task :start do
  port = 8080
  WEBrick::HTTPServer.new(
    :DocumentRoot  => './',
    :Port          => port,
    :StartCallback => proc { Launchy.open("http://localhost:#{port}") }
  ).start
end
