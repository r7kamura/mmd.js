# Load arraybuffer via XHR and invoke callback.
#
# ```
# MMD.Loader.load url, (arrayBuffer) ->
#   console.log(arrayBuffer)
# ```
class MMD.Loader
  # An utility function to load.
  @load: (args...) ->
    new this(args...).load()

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
