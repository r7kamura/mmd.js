# Load arraybuffer via XHR and invoke callback.
class this.Loader

  # Create a new instance of Loader, then call `load` of that.
  # This is a method object pattern.
  #
  # ```
  # Loader.load url, (arrayBuffer) ->
  #   console.log(arrayBuffer)
  # ```
  @load: (args...) ->
    loader = new this(args...)
    loader.load()

  # The constructor.
  #
  # ```
  # url      - a String of the resource to ArrayBuffer
  # callback - a Function called with the response object
  # ```
  constructor: (@url, @callback) ->

  # Request resource via XHR and invoke callback with response.
  load: ->
    request = new XMLHttpRequest()
    request.open('GET', @url)
    request.responseType = 'arraybuffer'
    request.send()
    request.onreadystatechange = =>
      @callback(request.response) if request.readyState == 4
