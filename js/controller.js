(function() {

  this.Controller = (function() {

    function Controller(model) {
      this.model = model;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer = this.createRenderer();
      this.scene = this.createScene();
      this.camera = this.createCamera();
      this.faces = this.createFaces();
    }

    Controller.prototype.render = function() {
      var face, _i, _len, _ref;
      document.body.appendChild(this.renderer.domElement);
      this.scene.add(this.camera);
      _ref = this.faces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        face = _ref[_i];
        this.scene.add(face);
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

    Controller.prototype.createFaces = function() {
      var enlargementFactor, face, geometry, interval, mesh, _i, _len, _ref, _results, _step;
      interval = 10;
      enlargementFactor = 30;
      _ref = this.model.faces;
      _results = [];
      for (_i = 0, _len = _ref.length, _step = interval; _i < _len; _i += _step) {
        face = _ref[_i];
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(this.model.vertexes[face[0]].position[0] * enlargementFactor, this.model.vertexes[face[0]].position[1] * enlargementFactor, this.model.vertexes[face[0]].position[2] * enlargementFactor));
        geometry.vertices.push(new THREE.Vector3(this.model.vertexes[face[1]].position[0] * enlargementFactor, this.model.vertexes[face[1]].position[1] * enlargementFactor, this.model.vertexes[face[1]].position[2] * enlargementFactor));
        geometry.vertices.push(new THREE.Vector3(this.model.vertexes[face[2]].position[0] * enlargementFactor, this.model.vertexes[face[2]].position[1] * enlargementFactor, this.model.vertexes[face[2]].position[2] * enlargementFactor));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
        _results.push(mesh);
      }
      return _results;
    };

    return Controller;

  })();

}).call(this);
