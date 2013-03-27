Loader.load '/data/example.pmx', (arrayBuffer) ->
  parser     = new ModelDataParser(arrayBuffer)
  model      = parser.parse()
  controller = new Controller(model)
  controller.render()
