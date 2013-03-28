Loader.load '/data/example.pmx', (arrayBuffer) ->
  parser     = new Parser(arrayBuffer)
  model      = parser.parse()
  controller = new Controller(model)
  controller.render()
