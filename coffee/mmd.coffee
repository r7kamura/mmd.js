# Define a namespace named `MMD` and an utility function to render model data.
#
# ```
# MMD.render('http://example.com/model.pmx')
# ```
this.MMD =
  render: (url) ->
    @Loader.load url, (arrayBuffer) =>
      model = @ModelParser.parse(arrayBuffer)
      new @Renderer(model).render()

  loadMotion: (url) ->
    @Loader.load url, (arrayBuffer) =>
      motion = @MotionParser.parse(arrayBuffer)
      console.log(motion)
