# MMD.js
![Hatsune Miku](http://dl.dropbox.com/u/5978869/image/20130329_010914.png)

( [Hatsune Miku](http://piapro.net/en_for_creators.html#prettyPhoto) / Crypton Future Media inc. / [CC BY-NC](http://creativecommons.org/licenses/by-nc/3.0/) )  
MMD.js is a project to work MMD in a web browser with client-side JavaScript.

## Development

### Install
```
$ gem install bundler
$ bundle install
$ npm install -g coffee-script
$ npm install -g docco
```

### Launch
```
$ bundle exec rake start
```

### Compile
```
$ bundle exec watchr watchr.rb
```

### Files
```
mmd.js
|-- coffee : main program code written in coffeescript
|-- data   : example model data for development use
|-- docs   : documents
`-- js     : compiled javascript files
```
