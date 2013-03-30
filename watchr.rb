watch(%r<^coffee/.+\.coffee>) do |patterns|
  system("bundle exec rake compile")
end
