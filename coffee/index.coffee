# This is a top page of documents of mmd.js.  
# See the documents from the link right above.
#
# # MMD.js
# MMD.js is a project to work MMD in a web browser with client-side JavaScript.
#
# ## Demo
# http://r7kamura.github.com/mmd.js/
#
# ## Documents
# http://r7kamura.github.com/mmd.js/docs/
#
# ## Development
#
# ### Install
# ```
# $ gem install bundler
# $ bundle install
# $ npm install -g coffee-script
# $ npm install -g docco
# ```
#
# ### Utility
# ```
# $ bundle exec rake -T
# rake all      # Launch server and keep auto-compile in multi-thread
# rake compile  # Compile coffee to js and documents
# rake server   # Launch server on localhost (Port is ENV['PORT'] or 8080)
#
# # compile
# $ bundle exec rake compile
#
# # server
# $ bundle exec rake server
#
# # all
# $ bundle exec rake all
# ```
#
# ### Files
# ```
# mms.js
# |-- coffee       : main program code written in coffeescript
# |-- data         : example model data for development use
# |-- docs         : documents generated by docco
# |-- js           : compiled javascript files
# |-- Gemfile      : list of gems we use for development
# |-- Rakefile     : list of tasks invoked from rake command
# |-- index.html   : example html file to render model data
# `-- watchr.rb    : a file invoked from watchr command for automation
# ```
