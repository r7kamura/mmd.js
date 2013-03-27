# Loads ArrayBuffer from g given URL via XHR
#
# url      - a String of the resource to ArrayBuffer
# callback - a Function called with the response object
#
# Example
#
#   # Fetch an ArrayBuffer from http://example.com/arraybuffer and print it out to console
#   Loader.load 'http://example.com/arraybuffer', (arrayBuffer) ->
#     console.log(arrayBuffer)
#
class this.Loader
  @load: (args...) ->
    loader = new this(args...)
    loader.load()

  constructor: (@url, @callback) ->

  load: ->
    request = new XMLHttpRequest()
    request.open('GET', @url)
    request.responseType = 'arraybuffer'
    request.send()
    request.onreadystatechange = =>
      @callback(request.response) if request.readyState == 4
