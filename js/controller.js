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
      this.scene.add(this.camera);
    }

    Controller.prototype.render = function() {
      document.body.appendChild(this.renderer.domElement);
      return this.animate();
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
      var camera;
      camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
      camera.position.z = 1000;
      return camera;
    };

    Controller.prototype.createVertexes = function() {
      var geometry, material, mesh, vertex, _i, _len, _ref, _results, _step;
      _ref = this.model.vertexes;
      _results = [];
      for (_i = 0, _len = _ref.length, _step = 10; _i < _len; _i += _step) {
        vertex = _ref[_i];
        geometry = new THREE.SphereGeometry(1);
        material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(vertex.position[0] * 30, vertex.position[1] * 30, vertex.position[2] * 30);
        _results.push(this.scene.add(mesh));
      }
      return _results;
    };

    return Controller;

  })();

}).call(this);
