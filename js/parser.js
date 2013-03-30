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
      this.model.vertexes = this.arrayOf('vertex');
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
      return String.fromCharCode(this.uint8());
    };

    Parser.prototype.chars = function(size) {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--) {
        _results.push(this.char());
      }
      return _results;
    };

    Parser.prototype.string = function(size) {
      return this.chars(size).join('');
    };

    Parser.prototype.bytes = function(size) {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.uint8());
      }
      return _results;
    };

    Parser.prototype.text = function() {
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

    Parser.prototype.xyz = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float()
      };
    };

    Parser.prototype.xyzw = function() {
      return {
        x: this.float(),
        y: this.float(),
        z: this.float(),
        w: this.float()
      };
    };

    Parser.prototype.uv = function() {
      return {
        u: this.float(),
        v: this.float()
      };
    };

    Parser.prototype.rgb = function() {
      return {
        r: this.float(),
        g: this.float(),
        b: this.float()
      };
    };

    Parser.prototype.rgba = function() {
      return {
        r: this.float(),
        g: this.float(),
        b: this.float(),
        a: this.float()
      };
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

    Parser.prototype.arrayOf = function(dataType, interval) {
      var _i, _ref, _results;
      if (interval == null) interval = 1;
      _results = [];
      for (_i = 0, _ref = this.int32() / interval; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this[dataType]());
      }
      return _results;
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
      return this.uint8();
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

    Parser.prototype.face = function() {
      return [this.vertexIndex(), this.vertexIndex(), this.vertexIndex()];
    };

    Parser.prototype.texture = function() {
      return this.texturePath();
    };

    Parser.prototype.texturePath = function() {
      return this.text();
    };

    Parser.prototype.material = function() {
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

    Parser.prototype.materialToonTexture = function() {
      switch (this.uint8()) {
        case 0:
          return this.textureIndex();
        case 1:
          return this.uint8();
      }
    };

    Parser.prototype.bone = function() {
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

    Parser.prototype.boneFlags = function() {
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

    Parser.prototype.boneLinks = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.boneLink());
      }
      return _results;
    };

    Parser.prototype.boneLink = function() {
      var bone, limited;
      bone = this.boneIndex();
      limited = this.uint8();
      return {
        bone: bone,
        lowerLimit: limited ? this.xyz() : void 0,
        upperLimit: limited ? this.xyz() : void 0
      };
    };

    Parser.prototype.morph = function() {
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

    Parser.prototype.morphRecordGroup = function() {
      return {
        index: this.morphIndex(),
        rate: this.float()
      };
    };

    Parser.prototype.frame = function() {
      return {
        name: this.text(),
        nameEnglish: this.text(),
        specialFrameFlag: this.uint8(),
        elements: this.frameElements()
      };
    };

    Parser.prototype.frameElements = function() {
      var _i, _ref, _results;
      _results = [];
      for (_i = 0, _ref = this.int32(); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
        _results.push(this.frameElement());
      }
      return _results;
    };

    Parser.prototype.frameElement = function() {
      if (this.uint8()) {
        return this.morphIndex();
      } else {
        return this.boneIndex();
      }
    };

    Parser.prototype.rigid = function() {
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

    Parser.prototype.joint = function() {
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

    return Parser;

  })();

}).call(this);
