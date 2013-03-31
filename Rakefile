require "webrick"
require "launchy"

desc "Launch server on localhost (Port is ENV['PORT'] or 3000)"
task :server do
  port = ENV["PORT"] || 3000
  WEBrick::HTTPServer.new(
    :DocumentRoot  => './',
    :Port          => port,
    :StartCallback => proc { Launchy.open("http://localhost:#{port}") }
  ).start
end

desc "Compile coffeescripts to javascripts and documents"
task :compile do
  files = Dir.glob("coffee/**/*.coffee").sort.join(" ")
  system("docco #{files}")
  system("coffee --join js/mmd.js --compile #{files}")
end

desc "Launch server and keep auto-compile in multi-thread"
task :all do
  Rake::Task[:compile].invoke
  Thread.new { Rake::Task[:server].invoke }
  system("bundle exec watchr watchr.rb")
end

task :default => :all
