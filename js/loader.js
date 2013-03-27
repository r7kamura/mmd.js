(function() {
  var __slice = Array.prototype.slice;

  this.Loader = (function() {

    Loader.load = function() {
      var args, loader;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      loader = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, args, function() {});
      return loader.load();
    };

    function Loader(url, callback) {
      this.url = url;
      this.callback = callback;
    }

    Loader.prototype.load = function() {
      var request,
        _this = this;
      request = new XMLHttpRequest();
      request.open('GET', this.url);
      request.responseType = 'arraybuffer';
      request.send();
      return request.onreadystatechange = function() {
        if (request.readyState === 4) return _this.callback(request.response);
      };
    };

    return Loader;

  })();

}).call(this);
