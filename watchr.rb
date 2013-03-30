# 1. Compile coffee to js
# 2. Generate documents from coffee by docco
watch(%r<^(coffee/.+.coffee)>) do |patterns|
  system("coffee -o js -c coffee")

  files = Dir.glob("coffee/**/*.coffee").join(" ")
  system("docco #{files}")
end
