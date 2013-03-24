# MMD.js
![Hatsune Miku](http://dl.dropbox.com/u/5978869/image/20130327_002308.png)

( [Hatsune Miku](http://piapro.net/en_for_creators.html#prettyPhoto) / Crypton Future Media inc. / [CC BY-NC](http://creativecommons.org/licenses/by-nc/3.0/) )  
MMD.js is a project to work MMD in a web browser with client-side JavaScript.

## Development

### Install
```
$ gem install bundler
$ bundle install
```

### Launch
```
$ bundle exec rake start
```

### Compile
```
$ coffee -o js -wc coffee
```

### Files
```
mmd.js
|-- coffee : main program code written in coffeescript
|-- data   : example model data for development use
|-- doc    : documents
`-- js     : compiled javascript files
```
