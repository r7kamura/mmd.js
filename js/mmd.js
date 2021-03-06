(function() {
  var __slice = Array.prototype.slice;

  this.MMD = {
    render: function(modelUrl, motionUrl) {
      var _this = this;
      return this.Loader.load(modelUrl, function(modelArrayBuffer) {
        return _this.Loader.load(motionUrl, function(motionArrayBuffer) {
          var model, motion, renderer;
          model = _this.ModelParser.parse(modelArrayBuffer);
          motion = _this.MotionParser.parse(motionArrayBuffer);
          renderer = new _this.Renderer(model);
          window.renderer = renderer;
          return renderer.render();
        });
      });
    }
  };

  MMD.Loader = (function() {

    Loader.load = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, args, function() {}).load();
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
      request.onreadystatechange = function() {
        return _this.onreadystatechange(request);
      };
      return request.send();
    };

    Loader.prototype.onreadystatechange = function(request) {
      if (request.readyState === 4) return this.callback(request.response);
    };

    return Loader;

  })();

  MMD.ModelParser = (function() {

    ModelParser.parse = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, args, function() {}).parse();
    };

    function ModelParser(arrayBuffer) {
      this.dataView = new DataView(arrayBuffer);
      this.index = 0;
      this.model = {};
      this.options = {};
      this.pmx = {};
    }

    ModelParser.prototype.parse = function() {
      this.pmx.name = this.string(4);
      this.pmx.version = this.float();
      this.options.headerSize = this.uint8();
      this.options.useUtf8 = this.uint8();
      this.options.extraUvSize = this.uint8();
      this.options.vertexIndexSize = this.uint8();
      this.options.textureIndexSize = this.uint8();
      this.options.materialIndexSize = this.uint8();
      this.options.boneIndexSize = this.uint8();
      this.options.morphIndexSize = this.uint8();
      this.options.rigidIndexSize = this.uint8();
      this.model.name = this.text();
      this.model.nameEnglish = this.text();
      this.model.comment = this.text();
      this.model.commentEnglish = this.text();
      this.model.vertices = this.arrayOf('vertex');
      this.model.faces = this.arrayOf('face', 3);
      this.model.textures = this.arrayOf('texture');
      this.model.materials = this.arrayOf('material');
      this.model.bones = this.arrayOf('bone');
      this.model.morphs = this.arrayOf('morph');
      this.model.frames = this.arrayOf('frame');
      this.model.rigids = this.arrayOf('rigid');
      this.model.joints = this.arrayOf('joint');
      return this.model;
    };

    ModelParser.prototype.int8 = function() {
      this.index += 1;
      return this.dataView.getInt8(this.index - 1, true);
    };

    ModelParser.prototype.int16 = function() {
      this.index += 2;
      return this.dataView.getInt16(this.index - 2, true);
    };

    ModelParser.prototype.int32 = function() {
      this.index += 4;
      return this.dataView.getInt32(this.index - 4, true);
    };

    ModelParser.prototype.uint8 = function() {
      this.index += 1;
      return this.dataView.getUint8(this.index - 1, true);
    };

    ModelParser.prototype.uint16 = function() {
      this.index += 2;
      return this.dataView.getUint16(this.index - 2, true);
    };

    ModelParser.prototype.float = function() {
      this.index += 4;
      return this.dataView.getFloat32(this.index - 4, true);
    };

    ModelParser.prototype.char = function() {
      return String.fromCharCode(this.uint8());
    };

    ModelParser.prototype.chars = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.char());
      }
      return _results;
    };

    ModelParser.prototype.string = function(size) {
      return this.chars(size).join('');
    };

    ModelParser.prototype.bytes = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.uint8());
      }
      return _results;
    };

    ModelParser.prototype.text = function() {
      var bytes, codes, i;
      bytes = this.bytes();
      codes = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = bytes.length; i < _ref; i += 2) {
          _results.push(bytes[i] + bytes[i + 1] * 256);
        }
        return _results;
      })();
      return String.fromCharCode.apply(null, codes);
    };

    ModelParser.prototype.xyz = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float()
      };
    };

    ModelParser.prototype.xyzw = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float(),
        w: this.float()
      };
    };

    ModelParser.prototype.uv = function() {
      return {
        u: this.float(),
        v: this.float()
      };
    };

    ModelParser.prototype.rgb = function() {
      return {
        r: this.float(),
        g: this.float(),
        b: this.float()
      };
    };

    ModelParser.prototype.rgba = function() {
      return {
        r: this.float(),
        g: this.float(),
        b: this.float(),
        a: this.float()
      };
    };

    ModelParser.prototype.vertexIndex = function() {
      switch (this.options.vertexIndexSize) {
        case 1:
          return this.uint8();
        case 2:
          return this.uint16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.boneIndex = function() {
      switch (this.options.boneIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.textureIndex = function() {
      switch (this.options.textureIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.materialIndex = function() {
      switch (this.options.materialIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.morphIndex = function() {
      switch (this.options.morphIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.rigidIndex = function() {
      switch (this.options.rigidIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    ModelParser.prototype.arrayOf = function(dataType, interval) {
      var _i, _ref, _results;
      if (interval == null) interval = 1;
      _results = [];
      for (_i = 0, _ref = this.int32() / interval; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this[dataType]());
      }
      return _results;
    };

    ModelParser.prototype.vertex = function() {
      return {
        position: this.xyz(),
        normal: this.xyz(),
        uv: this.uv(),
        extraUvs: this.vertexExtraUvs(),
        weight: this.vertexWeight(),
        edgeRate: this.vertexEdgeRate()
      };
    };

    ModelParser.prototype.vertexExtraUvs = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.options.extraUvSize; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.vertexExtraUv());
      }
      return _results;
    };

    ModelParser.prototype.vertexExtraUv = function() {
      return this.xyzw();
    };

    ModelParser.prototype.vertexWeight = function() {
      switch (this.vertexWeightType()) {
        case 0:
          return this.vertexWeightBdef1();
        case 1:
          return this.vertexWeightBdef2();
        case 2:
          return this.vertexWeightBdef4();
        case 3:
          return this.vertexWeightSdef();
      }
    };

    ModelParser.prototype.vertexWeightType = function() {
      return this.uint8();
    };

    ModelParser.prototype.vertexWeightBdef1 = function() {
      return this.boneIndex();
    };

    ModelParser.prototype.vertexWeightBdef2 = function() {
      return [this.boneIndex(), this.boneIndex(), this.vertexWeightRate()];
    };

    ModelParser.prototype.vertexWeightBdef4 = function() {
      return [this.boneIndex(), this.boneIndex(), this.boneIndex(), this.boneIndex(), this.vertexWeightRate(), this.vertexWeightRate(), this.vertexWeightRate(), this.vertexWeightRate()];
    };

    ModelParser.prototype.vertexWeightSdef = function() {
      return [this.boneIndex(), this.boneIndex(), this.vertexWeightRate(), this.vertexWeightCVector(), this.vertexWeightR0Vector(), this.vertexWeightR1Vector()];
    };

    ModelParser.prototype.vertexWeightCVector = function() {
      return this.xyz();
    };

    ModelParser.prototype.vertexWeightR0Vector = function() {
      return this.xyz();
    };

    ModelParser.prototype.vertexWeightR1Vector = function() {
      return this.xyz();
    };

    ModelParser.prototype.vertexWeightRate = function() {
      return this.float();
    };

    ModelParser.prototype.vertexEdgeRate = function() {
      return this.float();
    };

    ModelParser.prototype.face = function() {
      return [this.vertexIndex(), this.vertexIndex(), this.vertexIndex()];
    };

    ModelParser.prototype.texture = function() {
      return this.texturePath();
    };

    ModelParser.prototype.texturePath = function() {
      return this.text();
    };

    ModelParser.prototype.material = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        diffusion: this.rgba(),
        specular: this.rgb(),
        specularFactor: this.float(),
        ambient: this.rgb(),
        drawFlag: this.uint8(),
        edgeColor: this.rgba(),
        edgeSize: this.float(),
        normalTexture: this.textureIndex(),
        sphereIndex: this.textureIndex(),
        sphereMode: this.uint8(),
        toonTexture: this.materialToonTexture(),
        memo: this.text(),
        faceSize: this.int32()
      };
    };

    ModelParser.prototype.materialToonTexture = function() {
      switch (this.uint8()) {
        case 0:
          return this.textureIndex();
        case 1:
          return this.uint8();
      }
    };

    ModelParser.prototype.bone = function() {
      var flags, object;
      object = {};
      object.name = this.text();
      object.nameEnglish = this.text();
      object.position = this.xyz();
      object.parentBone = this.boneIndex();
      object.transitionState = this.int32();
      object.flags = flags = this.boneFlags();
      object.destination = flags.specifiedByIndex ? this.boneIndex() : this.xyz();
      if (flags.useAddedRotation || flags.useAddedTranslation) {
        object.addedBone = this.boneIndex();
      }
      if (flags.useAddedRotation || flags.useAddedTranslation) {
        object.addedRate = this.float();
      }
      if (flags.useFixedAxis) object.fixedAxis = this.xyz();
      if (flags.useLocalAxis) object.localAxisX = this.xyz();
      if (flags.useLocalAxis) object.localAxisZ = this.xyz();
      if (flags.useParentTransform) object.key = this.int32();
      if (flags.useIk) object.ikTargetBone = this.boneIndex();
      if (flags.useIk) object.ikLoop = this.int32();
      if (flags.useIk) object.ikLimit = this.float();
      if (flags.useIk) object.ikLinks = this.boneLinks();
      return object;
    };

    ModelParser.prototype.boneFlags = function() {
      var bits;
      bits = this.uint16();
      return {
        specifiedByIndex: !!(bits & 0x0001),
        useRotation: !!(bits & 0x0002),
        useTranslation: !!(bits & 0x0004),
        displayed: !!(bits & 0x0008),
        useControl: !!(bits & 0x0010),
        useIk: !!(bits & 0x0020),
        useAddedRotation: !!(bits & 0x0100),
        useAddedTranslation: !!(bits & 0x0200),
        useFixedAxis: !!(bits & 0x0400),
        useLocalAxis: !!(bits & 0x0800),
        usePhysicalTransform: !!(bits & 0x1000),
        useParentTransform: !!(bits & 0x2000)
      };
    };

    ModelParser.prototype.boneLinks = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.boneLink());
      }
      return _results;
    };

    ModelParser.prototype.boneLink = function() {
      var bone, limited;
      bone = this.boneIndex();
      limited = this.uint8();
      return {
        bone: bone,
        lowerLimit: limited ? this.xyz() : void 0,
        upperLimit: limited ? this.xyz() : void 0
      };
    };

    ModelParser.prototype.morph = function() {
      var object;
      object = {};
      object.name = this.text();
      object.nameEnglish = this.text();
      object.controlPanel = this.uint8();
      object.type = this.uint8();
      object.records = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.morphRecord(object.type));
        }
        return _results;
      }).call(this);
      return object;
    };

    ModelParser.prototype.morphRecord = function(type) {
      switch (type) {
        case 0:
          return this.morphRecordGroup();
        case 1:
          return this.morphRecordVertex();
        case 2:
          return this.morphRecordBone();
        case 3:
          return this.morphRecordUv();
        case 4:
          return this.morphRecordUv();
        case 5:
          return this.morphRecordUv();
        case 6:
          return this.morphRecordUv();
        case 7:
          return this.morphRecordUv();
        case 8:
          return this.morphRecordMaterial();
      }
    };

    ModelParser.prototype.morphRecordVertex = function() {
      return {
        index: this.vertexIndex(),
        offset: this.xyz()
      };
    };

    ModelParser.prototype.morphRecordUv = function() {
      return {
        index: this.vertexIndex(),
        offset: this.xyzw()
      };
    };

    ModelParser.prototype.morphRecordBone = function() {
      return {
        index: this.boneIndex(),
        translation: this.xyz(),
        rotation: this.xyzw()
      };
    };

    ModelParser.prototype.morphRecordMaterial = function() {
      return {
        index: this.materialIndex(),
        calculationType: this.uint8(),
        diffusion: this.rgba(),
        specular: this.rgb(),
        specularFactor: this.float(),
        ambient: this.rgb(),
        edgeColor: this.rgba(),
        edgeSize: this.float(),
        textureFactor: this.rgba(),
        sphereTextureFactor: this.rgba(),
        toonTextureFactor: this.rgba()
      };
    };

    ModelParser.prototype.morphRecordGroup = function() {
      return {
        index: this.morphIndex(),
        rate: this.float()
      };
    };

    ModelParser.prototype.frame = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        specialFrameFlag: this.uint8(),
        elements: this.frameElements()
      };
    };

    ModelParser.prototype.frameElements = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.frameElement());
      }
      return _results;
    };

    ModelParser.prototype.frameElement = function() {
      if (this.uint8()) {
        return this.morphIndex();
      } else {
        return this.boneIndex();
      }
    };

    ModelParser.prototype.rigid = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        boneIndex: this.boneIndex(),
        group: this.uint8(),
        collisionGroupFlag: this.uint16(),
        shape: this.uint8(),
        size: this.xyz(),
        position: this.xyz(),
        rotation: this.xyz(),
        mass: this.float(),
        translationDecay: this.float(),
        rotationDecay: this.float(),
        bounce: this.float(),
        friction: this.float(),
        calculationType: this.uint8()
      };
    };

    ModelParser.prototype.joint = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        type: this.uint8(),
        rigidA: this.rigidIndex(),
        rigidB: this.rigidIndex(),
        position: this.xyz(),
        rotation: this.xyz(),
        lowerTranslationLimit: this.xyz(),
        upperTranslationLimit: this.xyz(),
        lowerRotationLimit: this.xyz(),
        upperRotationLimit: this.xyz(),
        translationSpringFactor: this.xyz(),
        rationSpringFactor: this.xyz()
      };
    };

    return ModelParser;

  })();

  MMD.MotionParser = (function() {

    MotionParser.parse = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(this, args, function() {}).parse();
    };

    function MotionParser(arrayBuffer) {
      this.dataView = new DataView(arrayBuffer);
      this.index = 0;
    }

    MotionParser.prototype.parse = function() {
      return {
        name1: this.text(30),
        name2: this.text(20),
        bones: this.arrayOf('bone'),
        morphs: this.arrayOf('morph'),
        cameras: this.arrayOf('camera'),
        lights: this.arrayOf('light'),
        shadows: this.arrayOf('shadow')
      };
    };

    MotionParser.prototype.uint8 = function() {
      this.index += 1;
      return this.dataView.getUint8(this.index - 1, true);
    };

    MotionParser.prototype.uint32 = function() {
      this.index += 4;
      return this.dataView.getUint16(this.index - 4, true);
    };

    MotionParser.prototype.char = function() {
      return this.uint8();
    };

    MotionParser.prototype.chars = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.char());
      }
      return _results;
    };

    MotionParser.prototype.float = function() {
      this.index += 4;
      return this.dataView.getFloat32(this.index - 4, true);
    };

    MotionParser.prototype.bytes = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.uint8());
      }
      return _results;
    };

    MotionParser.prototype.text = function(size) {
      return Sjis.fromArrayToString(this.bytes(size));
    };

    MotionParser.prototype.arrayOf = function(dataType) {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.uint32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this[dataType]());
      }
      return _results;
    };

    MotionParser.prototype.xyz = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float()
      };
    };

    MotionParser.prototype.xyzw = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float(),
        w: this.float()
      };
    };

    MotionParser.prototype.rgb = function() {
      return {
        r: this.float(),
        g: this.float(),
        b: this.float()
      };
    };

    MotionParser.prototype.bone = function() {
      return {
        name: this.text(15),
        frame: this.uint32(),
        position: this.xyz(),
        quaternion: this.xyzw(),
        interporation: this.chars(64)
      };
    };

    MotionParser.prototype.morph = function() {
      return {
        name: this.text(15),
        frame: this.uint32(),
        value: this.float()
      };
    };

    MotionParser.prototype.camera = function() {
      return {
        name: this.text(15),
        frame: this.uint32(),
        value: this.float(),
        distance: this.float(),
        position: this.xyz(),
        rotation: this.xyz(),
        interporation: this.chars(24),
        angle: this.uint32(),
        perspective: this.char()
      };
    };

    MotionParser.prototype.light = function() {
      return {
        frame: this.uint32(),
        color: this.rgb(),
        position: this.xyz()
      };
    };

    MotionParser.prototype.shadow = function() {
      return {
        frame: this.uint32(),
        type: this.char(),
        distance: this.float()
      };
    };

    return MotionParser;

  })();

  MMD.Renderer = (function() {

    Renderer.render = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new this.apply(null, args).render;
    };

    function Renderer(model, motion) {
      this.model = model;
      this.motion = motion;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer = this.createRenderer();
      this.scene = this.createScene();
      this.camera = this.createCamera();
      this.bones = this.createBones();
      this.stats = this.createStats();
      this.frame = 0;
      this.addFaces();
    }

    Renderer.prototype.render = function() {
      document.body.appendChild(this.renderer.domElement);
      document.body.appendChild(this.stats.domElement);
      return this.animate();
    };

    Renderer.prototype.animate = function() {
      var _this = this;
      window.requestAnimationFrame(function() {
        return _this.animate();
      });
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
      return this.incrementFrame();
    };

    Renderer.prototype.incrementFrame = function() {
      return this.frame += 1;
    };

    Renderer.prototype.createRenderer = function() {
      var renderer;
      renderer = new THREE.CanvasRenderer({
        antialias: true
      });
      renderer.setSize(this.width, this.height);
      return renderer;
    };

    Renderer.prototype.createScene = function() {
      return new THREE.Scene();
    };

    Renderer.prototype.createCamera = function() {
      var angleOfView, aspect, camera, clipFar, clipNear;
      angleOfView = 75;
      aspect = this.width / this.height;
      clipNear = 1;
      clipFar = 10000;
      camera = new THREE.PerspectiveCamera(angleOfView, aspect, clipNear, clipFar);
      camera.position.y = 20;
      camera.position.z = -20;
      camera.lookAt({
        x: 0,
        y: 10,
        z: 0
      });
      return camera;
    };

    Renderer.prototype.addFaces = function() {
      var face, geometry, interval, mesh, _i, _len, _ref, _results, _step;
      interval = 100;
      _ref = this.model.faces;
      _results = [];
      for (_i = 0, _len = _ref.length, _step = interval; _i < _len; _i += _step) {
        face = _ref[_i];
        geometry = new THREE.Geometry();
        geometry.vertices = [this.model.vertices[face[0]].position, this.model.vertices[face[1]].position, this.model.vertices[face[2]].position];
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
        _results.push(this.scene.add(mesh));
      }
      return _results;
    };

    Renderer.prototype.createBones = function() {
      var bone, geometry, material, mesh, _i, _len, _ref, _results;
      _ref = this.model.bones;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bone = _ref[_i];
        geometry = new THREE.SphereGeometry(0.1);
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = bone.position.x;
        mesh.position.y = bone.position.y;
        mesh.position.z = bone.position.z;
        _results.push(mesh);
      }
      return _results;
    };

    Renderer.prototype.getTableFromBoneNameToBone = function() {
      var _this = this;
      return this.tableFromBoneNameToBone || (this.tableFromBoneNameToBone = (function() {
        var bone, table, _i, _len, _ref;
        table = {};
        _ref = _this.model.bones;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bone = _ref[_i];
          table[bone.name] = bone;
        }
        return table;
      })());
    };

    Renderer.prototype.createStats = function() {
      return new Stats();
    };

    return Renderer;

  })();

}).call(this);
