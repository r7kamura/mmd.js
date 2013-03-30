# Define a namespace named `MMD` and an utility function to render model data.
#
# ```
# MMD.render('http://example.com/model.pmx')
# ```
this.MMD =
  render: (url) ->
    @Loader.load url, (arrayBuffer) =>
      model = @Parser.parse(arrayBuffer)
      new @Renderer(model).render()
