(function() {

  Loader.load('/data/example.pmx', function(arrayBuffer) {
    var controller, model, parser;
    parser = new Parser(arrayBuffer);
    model = parser.parse();
    controller = new Controller(model);
    return controller.render();
  });

}).call(this);