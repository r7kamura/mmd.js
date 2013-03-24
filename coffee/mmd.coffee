getArrayBuffer = (url, callback) ->
  request = new XMLHttpRequest()
  request.open('GET', url)
  request.responseType = 'arraybuffer'
  request.send()
  request.onreadystatechange = ->
    if request.readyState == 4
      callback(request.response)

getArrayBuffer '/data/example.pmx', (arrayBuffer) ->
  dataView     = new DataView(arrayBuffer)
  parser       = new ModelDataParser(dataView)
  window.model = parser.parse()
  console.log(window.model)

class ModelDataParser
  constructor: (@dataView) ->
    @index   = 0
    @model   = {}
    @options = {}
    @pmx     = {}

  byte: () ->
    @uint8()

  int: () ->
    @int32()

  int8: () ->
    @index += 1
    @dataView.getInt8(@index - 1, true)

  int16: () ->
    @index += 2
    @dataView.getInt16(@index - 2, true)

  int32: () ->
    @index += 4
    @dataView.getInt32(@index - 4, true)

  uint8: () ->
    @index += 1
    @dataView.getUint8(@index - 1, true)

  uint16: () ->
    @index += 2
    @dataView.getUint16(@index - 2, true)

  float: () ->
    @index += 4
    @dataView.getFloat32(@index - 4, true)

  char: ()->
    String.fromCharCode(@byte())

  chars: (size) ->
    @char() for [0...size]

  bytes: (size) ->
    @byte() for [0...size]

  floats: (size) ->
    @float() for [0...size]

  text: ->
    @bytes(@int())

  xyz: ->
    @floats(3)

  xyzw: ->
    @floats(4)

  uv: ->
    @floats(2)

  rgb: ->
    @floats(3)

  rgba: ->
    @floats(4)

  vertexIndex: ->
    switch @options.vertexIndexSize
      when 1 then @uint8()
      when 2 then @uint16()
      when 4 then @int32()

  boneIndex: ->
    switch @options.boneIndexSize
      when 1 then @int8()
      when 2 then @int16()
      when 4 then @int32()

  textureIndex: ->
    switch @options.textureIndexSize
      when 1 then @int8()
      when 2 then @int16()
      when 4 then @int32()

  materialIndex: ->
    switch @options.materialIndexSize
      when 1 then @int8()
      when 2 then @int16()
      when 4 then @int32()

  morphIndex: ->
    switch @options.morphIndexSize
      when 1 then @int8()
      when 2 then @int16()
      when 4 then @int32()

  rigidIndex: ->
    switch @options.rigidIndexSize
      when 1 then @int8()
      when 2 then @int16()
      when 4 then @int32()

  parse: ->
    @modelData()
    @model

  modelData: ->
    @modelHeader()
    @modelInformation()
    @vertexes()
    @faces()
    @textures()
    @materials()
    @bones()
    @morphs()
    @frames()
    @rigids()
    @joints()

  modelHeader: ->
    @pmxName()
    @pmxVersion()
    @modelStructureInformation()

  pmxName: ->
    @pmx.name = @chars(4).join('')

  pmxVersion: ->
    @pmx.version = @float()

  modelStructureInformation: ->
    @modelStructureInformationSize()
    @useUtf8()
    @extraUvSize()
    @vertexIndexSize()
    @textureIndexSize()
    @materialIndexSize()
    @boneIndexSize()
    @morphIndexSize()
    @rigidIndexSize()

  modelStructureInformationSize: ->
    @byte()

  useUtf8: ->
    @options.useUtf8 = !!@byte()

  extraUvSize: ->
    @options.extraUvSize = @byte()

  vertexIndexSize: ->
    @options.vertexIndexSize = @byte()

  textureIndexSize: ->
    @options.textureIndexSize = @byte()

  materialIndexSize: ->
    @options.materialIndexSize = @byte()

  boneIndexSize: ->
    @options.boneIndexSize = @byte()

  morphIndexSize: ->
    @options.morphIndexSize = @byte()

  rigidIndexSize: ->
    @options.rigidIndexSize = @byte()

  modelInformation: ->
    @modelName()
    @modelNameEnglish()
    @modelComment()
    @modelCommentEnglish()

  modelName: ->
    @model.name = @text()

  modelNameEnglish: ->
    @model.nameEnglish = @text()

  modelComment: ->
    @model.comment = @text()

  modelCommentEnglish: ->
    @model.commentEnglish = @text()

  vertexes: ->
    @model.vertexes = (@vertex() for [0...@int()])

  vertex: ->
    position: @xyz()
    normal: @xyz()
    uv: @uv()
    extraUvs: @vertexExtraUvs()
    weight: @vertexWeight()
    edgeRate: @vertexEdgeRate()

  vertexExtraUvs: ->
    @vertexExtraUv() for [0...@options.extraUvSize]

  vertexExtraUv: ->
    @xyzw()

  vertexWeight: ->
    switch @vertexWeightType()
      when 0 then @vertexWeightBdef1()
      when 1 then @vertexWeightBdef2()
      when 2 then @vertexWeightBdef4()
      when 3 then @vertexWeightSdef()

  vertexWeightType: ->
    @byte()

  vertexWeightBdef1: ->
    @boneIndex()

  vertexWeightBdef2: ->
    [
      @boneIndex()
      @boneIndex()
      @vertexWeightRate()
    ]

  vertexWeightBdef4: ->
    [
      @boneIndex()
      @boneIndex()
      @boneIndex()
      @boneIndex()
      @vertexWeightRate()
      @vertexWeightRate()
      @vertexWeightRate()
      @vertexWeightRate()
    ]

  vertexWeightSdef: ->
    [
      @boneIndex()
      @boneIndex()
      @vertexWeightRate()
      @vertexWeightCVector()
      @vertexWeightR0Vector()
      @vertexWeightR1Vector()
    ]

  vertexWeightCVector: ->
    @xyz()

  vertexWeightR0Vector: ->
    @xyz()

  vertexWeightR1Vector: ->
    @xyz()

  vertexWeightRate: ->
    @float()

  vertexEdgeRate: ->
    @float()

  faces: ->
    @model.faces = (@face() for [0...@int()])

  face: ->
    @vertexIndex()

  textures: ->
    @model.textures = (@texture() for [0...@int()])

  texture: ->
    @texturePath()

  texturePath: ->
    @text()

  materials: ->
    @model.materials = (@material() for [0...@int()])

  material: ->
    name: @text()
    nameEnglish: @text()
    diffusion: @rgba()
    specular: @rgb()
    specularFactor: @float()
    ambient: @rgb()
    drawFlag: @byte()
    edgeColor: @rgba()
    edgeSize: @float()
    normalTexture: @textureIndex()
    sphereIndex: @textureIndex()
    sphereMode: @byte()
    toonTexture: @materialToonTexture()
    memo: @text()
    faceSize: @int()

  materialToonTexture: ->
    switch @byte()
      when 0 then @textureIndex()
      when 1 then @byte()

  bones: ->
    @model.bones = (@bone() for [0...@int()])

  bone: ->
    object                 = {}
    object.name            = @text()
    object.nameEnglish     = @text()
    object.position        = @xyz()
    object.parentBone      = @boneIndex()
    object.transitionState = @int()
    object.flags           = flags = @boneFlags()
    object.destination     = if flags.specifiedByIndex then @boneIndex() else @xyz()
    object.addedBone       = @boneIndex() if flags.useAddedRotation || flags.useAddedTranslation
    object.addedRate       = @float() if flags.useAddedRotation || flags.useAddedTranslation
    object.fixedAxis       = @xyz() if flags.useFixedAxis
    object.localAxisX      = @xyz() if flags.useLocalAxis
    object.localAxisZ      = @xyz() if flags.useLocalAxis
    object.key             = @int() if flags.useParentTransform
    object.ikTargetBone    = @boneIndex() if flags.useIk
    object.ikLoop          = @int() if flags.useIk
    object.ikLimit         = @float() if flags.useIk
    object.ikLinks         = @boneLinks() if flags.useIk
    object

  boneFlags: ->
    bits = @uint16()
    specifiedByIndex:     !!(bits & 1)
    useRotation:          !!(bits & 2)
    useTranslation:       !!(bits & 4)
    displayed:            !!(bits & 8)
    useControl:           !!(bits & 16)
    useIk:                !!(bits & 32)
    useAddedRotation:     !!(bits & 256)
    useAddedTranslation:  !!(bits & 512)
    useFixedAxis:         !!(bits & 1024)
    useLocalAxis:         !!(bits & 2048)
    usePhysicalTransform: !!(bits & 4096)
    useParentTransform:   !!(bits & 8192)

  boneLinks: ->
    (@boneLink() for [0...@int()])

  boneLink: ->
    bone    = @boneIndex()
    limited = @byte()
    bone: bone
    lowerLimit: @xyz() if limited
    upperLimit: @xyz() if limited

  morphs: ->
    @model.morphs = (@morph() for [0...@int()])

  morph: ->
    object              = {}
    object.name         = @text()
    object.nameEnglish  = @text()
    object.controlPanel = @byte()
    object.type         = @byte()
    object.records      = (@morphRecord(object.type) for [0...@int()])
    object

  morphRecord: (type) ->
    switch type
      when 0 then @morphRecordGroup()
      when 1 then @morphRecordVertex()
      when 2 then @morphRecordBone()
      when 3 then @morphRecordUv()
      when 4 then @morphRecordUv()
      when 5 then @morphRecordUv()
      when 6 then @morphRecordUv()
      when 7 then @morphRecordUv()
      when 8 then @morphRecordMaterial()

  morphRecordVertex: ->
    index: @vertexIndex()
    offset: @xyz()

  morphRecordUv: ->
    index: @vertexIndex()
    offset: @xyzw()

  morphRecordBone: ->
    index: @boneIndex()
    translation: @xyz()
    rotation: @xyzw()

  morphRecordMaterial: ->
    index: @materialIndex()
    calculationType: @byte()
    diffusion: @rgba()
    specular: @rgb()
    specularFactor: @float()
    ambient: @rgb()
    edgeColor: @rgba()
    edgeSize: @float()
    textureFactor: @rgba()
    sphereTextureFactor: @rgba()
    toonTextureFactor: @rgba()

  morphRecordGroup: ->
    index: @morphIndex()
    rate: @float()

  frames: ->
    @model.frame = (@frame() for [0...@int()])

  frame: ->
    name: @text()
    nameEnglish: @text()
    specialFrameFlag: @byte()
    elements: @frameElements()

  frameElements: ->
    @frameElement() for [0...@int()]

  frameElement: ->
    if @byte()
      @morphIndex()
    else
      @boneIndex()

  rigids: ->
    @model.rigid = (@rigid() for [0...@int()])

  rigid: ->
    name: @text()
    nameEnglish: @text()
    boneIndex: @boneIndex()
    group: @byte()
    collisionGroupFlag: @uint16()
    shape: @byte()
    size: @xyz()
    position: @xyz()
    rotation: @xyz()
    mass: @float()
    translationDecay: @float()
    rotationDecay: @float()
    bounce: @float()
    friction: @float()
    calculationType: @byte()

  joints: ->
    @model.joints = (@joint() for [0...@int()])

  joint: ->
    name: @text()
    nameEnglish: @text()
    type: @byte()
    rigidA: @rigidIndex()
    rigidB: @rigidIndex()
    position: @xyz()
    rotation: @xyz()
    lowerTranslationLimit: @xyz()
    upperTranslationLimit: @xyz()
    lowerRotationLimit: @xyz()
    upperRotationLimit: @xyz()
    translationSpringFactor: @xyz()
    rationSpringFactor: @xyz()
