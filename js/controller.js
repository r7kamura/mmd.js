(function() {

  this.Controller = (function() {

    function Controller(model) {
      this.model = model;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer = this.createRenderer();
      this.scene = this.createScene();
      this.camera = this.createCamera();
      this.vertexes = this.createVertexes();
    }

    Controller.prototype.render = function() {
      var vertex, _i, _len, _ref;
      document.body.appendChild(this.renderer.domElement);
      this.scene.add(this.camera);
      _ref = this.vertexes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vertex = _ref[_i];
        this.scene.add(vertex);
      }
      return this.renderer.render(this.scene, this.camera);
    };

    Controller.prototype.animate = function() {
      var _this = this;
      window.requestAnimationFrame(function() {
        return _this.animate();
      });
      return this.renderer.render(this.scene, this.camera);
    };

    Controller.prototype.createRenderer = function() {
      var renderer;
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(this.width, this.height);
      return renderer;
    };

    Controller.prototype.createScene = function() {
      return new THREE.Scene();
    };

    Controller.prototype.createCamera = function() {
      var angleOfView, aspect, camera, clipFar, clipNear;
      angleOfView = 75;
      aspect = this.width / this.height;
      clipNear = 1;
      clipFar = 10000;
      camera = new THREE.PerspectiveCamera(angleOfView, aspect, clipNear, clipFar);
      camera.position.z = 1000;
      return camera;
    };

    Controller.prototype.createVertexes = function() {
      var enlargementFactor, geometry, interval, material, mesh, meshColor, vertex, _i, _len, _ref, _results, _step;
      interval = 100;
      enlargementFactor = 30;
      meshColor = 0xff0000;
      _ref = this.model.vertexes;
      _results = [];
      for (_i = 0, _len = _ref.length, _step = interval; _i < _len; _i += _step) {
        vertex = _ref[_i];
        geometry = new THREE.SphereGeometry(1);
        material = new THREE.MeshBasicMaterial({
          color: meshColor,
          wireframe: true
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(vertex.position[0] * enlargementFactor, vertex.position[1] * enlargementFactor, vertex.position[2] * enlargementFactor);
        _results.push(mesh);
      }
      return _results;
    };

    return Controller;

  })();

}).call(this);
