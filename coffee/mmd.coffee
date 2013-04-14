# Define a namespace named `MMD` and an utility function to render model data.
#
# ```
# MMD.render('http://example.com/model.pmx')
# ```
this.MMD =
  render: (modelUrl, motionUrl) ->
    @Loader.load modelUrl, (modelArrayBuffer) =>
      @Loader.load motionUrl, (motionArrayBuffer) =>
        model    = @ModelParser.parse(modelArrayBuffer)
        motion   = @MotionParser.parse(motionArrayBuffer)
        renderer = new @Renderer(model)
        window.renderer = renderer
        renderer.render()
