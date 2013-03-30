(function() {

  this.Parser = (function() {

    function Parser(arrayBuffer) {
      this.dataView = new DataView(arrayBuffer);
      this.index = 0;
      this.model = {};
      this.options = {};
      this.pmx = {};
    }

    Parser.prototype.parse = function() {
      this.modelData();
      return this.model;
    };

    Parser.prototype.modelData = function() {
      this.modelHeader();
      this.model.name = this.text();
      this.model.nameEnglish = this.text();
      this.model.comment = this.text();
      this.model.commentEnglish = this.text();
      this.model.vertexes = this.vertexes();
      this.model.faces = this.faces();
      this.model.textures = this.textures();
      this.model.materials = this.materials();
      this.model.bones = this.bones();
      this.model.morphs = this.morphs();
      this.model.frames = this.frames();
      this.model.rigids = this.rigids();
      return this.model.joints = this.joints();
    };

    Parser.prototype.byte = function() {
      return this.uint8();
    };

    Parser.prototype.int = function() {
      return this.int32();
    };

    Parser.prototype.int8 = function() {
      this.index += 1;
      return this.dataView.getInt8(this.index - 1, true);
    };

    Parser.prototype.int16 = function() {
      this.index += 2;
      return this.dataView.getInt16(this.index - 2, true);
    };

    Parser.prototype.int32 = function() {
      this.index += 4;
      return this.dataView.getInt32(this.index - 4, true);
    };

    Parser.prototype.uint8 = function() {
      this.index += 1;
      return this.dataView.getUint8(this.index - 1, true);
    };

    Parser.prototype.uint16 = function() {
      this.index += 2;
      return this.dataView.getUint16(this.index - 2, true);
    };

    Parser.prototype.float = function() {
      this.index += 4;
      return this.dataView.getFloat32(this.index - 4, true);
    };

    Parser.prototype.char = function() {
      return String.fromCharCode(this.byte());
    };

    Parser.prototype.chars = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.char());
      }
      return _results;
    };

    Parser.prototype.bytes = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.byte());
      }
      return _results;
    };

    Parser.prototype.floats = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.float());
      }
      return _results;
    };

    Parser.prototype.text = function() {
      var bytes, codes, i;
      bytes = this.bytes(this.int());
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

    Parser.prototype.xyz = function() {
      return this.floats(3);
    };

    Parser.prototype.xyzw = function() {
      return this.floats(4);
    };

    Parser.prototype.uv = function() {
      return this.floats(2);
    };

    Parser.prototype.rgb = function() {
      return this.floats(3);
    };

    Parser.prototype.rgba = function() {
      return this.floats(4);
    };

    Parser.prototype.vertexIndex = function() {
      switch (this.options.vertexIndexSize) {
        case 1:
          return this.uint8();
        case 2:
          return this.uint16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.boneIndex = function() {
      switch (this.options.boneIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.textureIndex = function() {
      switch (this.options.textureIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.materialIndex = function() {
      switch (this.options.materialIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.morphIndex = function() {
      switch (this.options.morphIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.rigidIndex = function() {
      switch (this.options.rigidIndexSize) {
        case 1:
          return this.int8();
        case 2:
          return this.int16();
        case 4:
          return this.int32();
      }
    };

    Parser.prototype.modelHeader = function() {
      this.pmxName();
      this.pmxVersion();
      return this.options = this.modelStructureInformation();
    };

    Parser.prototype.pmxName = function() {
      return this.pmx.name = this.chars(4).join('');
    };

    Parser.prototype.pmxVersion = function() {
      return this.pmx.version = this.float();
    };

    Parser.prototype.modelStructureInformation = function() {
      this.modelStructureInformationSize();
      return {
        useUtf8: this.byte(),
        extraUvSize: this.byte(),
        vertexIndexSize: this.byte(),
        textureIndexSize: this.byte(),
        materialIndexSize: this.byte(),
        boneIndexSize: this.byte(),
        morphIndexSize: this.byte(),
        rigidIndexSize: this.byte()
      };
    };

    Parser.prototype.modelStructureInformationSize = function() {
      return this.byte();
    };

    Parser.prototype.vertexes = function() {
      return this.model.vertexes = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.vertex());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.vertex = function() {
      return {
        position: this.xyz(),
        normal: this.xyz(),
        uv: this.uv(),
        extraUvs: this.vertexExtraUvs(),
        weight: this.vertexWeight(),
        edgeRate: this.vertexEdgeRate()
      };
    };

    Parser.prototype.vertexExtraUvs = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.options.extraUvSize; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.vertexExtraUv());
      }
      return _results;
    };

    Parser.prototype.vertexExtraUv = function() {
      return this.xyzw();
    };

    Parser.prototype.vertexWeight = function() {
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

    Parser.prototype.vertexWeightType = function() {
      return this.byte();
    };

    Parser.prototype.vertexWeightBdef1 = function() {
      return this.boneIndex();
    };

    Parser.prototype.vertexWeightBdef2 = function() {
      return [this.boneIndex(), this.boneIndex(), this.vertexWeightRate()];
    };

    Parser.prototype.vertexWeightBdef4 = function() {
      return [this.boneIndex(), this.boneIndex(), this.boneIndex(), this.boneIndex(), this.vertexWeightRate(), this.vertexWeightRate(), this.vertexWeightRate(), this.vertexWeightRate()];
    };

    Parser.prototype.vertexWeightSdef = function() {
      return [this.boneIndex(), this.boneIndex(), this.vertexWeightRate(), this.vertexWeightCVector(), this.vertexWeightR0Vector(), this.vertexWeightR1Vector()];
    };

    Parser.prototype.vertexWeightCVector = function() {
      return this.xyz();
    };

    Parser.prototype.vertexWeightR0Vector = function() {
      return this.xyz();
    };

    Parser.prototype.vertexWeightR1Vector = function() {
      return this.xyz();
    };

    Parser.prototype.vertexWeightRate = function() {
      return this.float();
    };

    Parser.prototype.vertexEdgeRate = function() {
      return this.float();
    };

    Parser.prototype.faces = function() {
      return this.model.faces = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int() / 3; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.face());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.face = function() {
      return [this.vertexIndex(), this.vertexIndex(), this.vertexIndex()];
    };

    Parser.prototype.textures = function() {
      return this.model.textures = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.texture());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.texture = function() {
      return this.texturePath();
    };

    Parser.prototype.texturePath = function() {
      return this.text();
    };

    Parser.prototype.materials = function() {
      return this.model.materials = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.material());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.material = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        diffusion: this.rgba(),
        specular: this.rgb(),
        specularFactor: this.float(),
        ambient: this.rgb(),
        drawFlag: this.byte(),
        edgeColor: this.rgba(),
        edgeSize: this.float(),
        normalTexture: this.textureIndex(),
        sphereIndex: this.textureIndex(),
        sphereMode: this.byte(),
        toonTexture: this.materialToonTexture(),
        memo: this.text(),
        faceSize: this.int()
      };
    };

    Parser.prototype.materialToonTexture = function() {
      switch (this.byte()) {
        case 0:
          return this.textureIndex();
        case 1:
          return this.byte();
      }
    };

    Parser.prototype.bones = function() {
      return this.model.bones = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.bone());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.bone = function() {
      var flags, object;
      object = {};
      object.name = this.text();
      object.nameEnglish = this.text();
      object.position = this.xyz();
      object.parentBone = this.boneIndex();
      object.transitionState = this.int();
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
      if (flags.useParentTransform) object.key = this.int();
      if (flags.useIk) object.ikTargetBone = this.boneIndex();
      if (flags.useIk) object.ikLoop = this.int();
      if (flags.useIk) object.ikLimit = this.float();
      if (flags.useIk) object.ikLinks = this.boneLinks();
      return object;
    };

    Parser.prototype.boneFlags = function() {
      var bits;
      bits = this.uint16();
      return {
        specifiedByIndex: !!(bits & 1),
        useRotation: !!(bits & 2),
        useTranslation: !!(bits & 4),
        displayed: !!(bits & 8),
        useControl: !!(bits & 16),
        useIk: !!(bits & 32),
        useAddedRotation: !!(bits & 256),
        useAddedTranslation: !!(bits & 512),
        useFixedAxis: !!(bits & 1024),
        useLocalAxis: !!(bits & 2048),
        usePhysicalTransform: !!(bits & 4096),
        useParentTransform: !!(bits & 8192)
      };
    };

    Parser.prototype.boneLinks = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.boneLink());
      }
      return _results;
    };

    Parser.prototype.boneLink = function() {
      var bone, limited;
      bone = this.boneIndex();
      limited = this.byte();
      return {
        bone: bone,
        lowerLimit: limited ? this.xyz() : void 0,
        upperLimit: limited ? this.xyz() : void 0
      };
    };

    Parser.prototype.morphs = function() {
      return this.model.morphs = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.morph());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.morph = function() {
      var object;
      object = {};
      object.name = this.text();
      object.nameEnglish = this.text();
      object.controlPanel = this.byte();
      object.type = this.byte();
      object.records = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.morphRecord(object.type));
        }
        return _results;
      }).call(this);
      return object;
    };

    Parser.prototype.morphRecord = function(type) {
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

    Parser.prototype.morphRecordVertex = function() {
      return {
        index: this.vertexIndex(),
        offset: this.xyz()
      };
    };

    Parser.prototype.morphRecordUv = function() {
      return {
        index: this.vertexIndex(),
        offset: this.xyzw()
      };
    };

    Parser.prototype.morphRecordBone = function() {
      return {
        index: this.boneIndex(),
        translation: this.xyz(),
        rotation: this.xyzw()
      };
    };

    Parser.prototype.morphRecordMaterial = function() {
      return {
        index: this.materialIndex(),
        calculationType: this.byte(),
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

    Parser.prototype.morphRecordGroup = function() {
      return {
        index: this.morphIndex(),
        rate: this.float()
      };
    };

    Parser.prototype.frames = function() {
      return this.model.frame = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.frame());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.frame = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        specialFrameFlag: this.byte(),
        elements: this.frameElements()
      };
    };

    Parser.prototype.frameElements = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.frameElement());
      }
      return _results;
    };

    Parser.prototype.frameElement = function() {
      if (this.byte()) {
        return this.morphIndex();
      } else {
        return this.boneIndex();
      }
    };

    Parser.prototype.rigids = function() {
      return this.model.rigid = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.rigid());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.rigid = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        boneIndex: this.boneIndex(),
        group: this.byte(),
        collisionGroupFlag: this.uint16(),
        shape: this.byte(),
        size: this.xyz(),
        position: this.xyz(),
        rotation: this.xyz(),
        mass: this.float(),
        translationDecay: this.float(),
        rotationDecay: this.float(),
        bounce: this.float(),
        friction: this.float(),
        calculationType: this.byte()
      };
    };

    Parser.prototype.joints = function() {
      return this.model.joints = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = this.int(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(this.joint());
        }
        return _results;
      }).call(this);
    };

    Parser.prototype.joint = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        type: this.byte(),
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

    return Parser;

  })();

}).call(this);
