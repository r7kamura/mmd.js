# Parse arrayBuffer as model data in PMX format by Recursive Descendent Parsing style.
#
# ### data type
# The PMX format is binary data,
# and it consists of an series of int8, int16, int32, uint8, uint16, and float32.
#
# ### encoding
# The string in PMX format is encoded as UTF8 or UTF16LE.
# Authors of PMX data can select one of them, and it is stored in the header segment.
#
# ### example
# ```
# model = new MMD.ModelParser.parse(arrayBuffer)
# ```
class MMD.ModelParser
  # An utility function to parse.
  @parse: (args...) ->
    new this(args...).parse()

  # The constructor.
  #
  # ```
  # arrayBuffer - ArrayBuffer of binary model data
  # @dataView   - DataView object to read ArrayBuffer
  # @index      - Integer of a position for DataView
  # @model      - Object of parsed model data
  # @options    - Object of parsed metadata
  # @pmx        - Object of parsed PMX metadata
  # ```
  constructor: (arrayBuffer) ->
    @dataView = new DataView(arrayBuffer)
    @index    = 0
    @model    = {}
    @options  = {}
    @pmx      = {}

  # Parse model data and return a parsed data object.
  # This function also represents the contents of PMX data.
  parse: ->
    @pmx.name                  = @string(4)
    @pmx.version               = @float()
    @options.headerSize        = @uint8()
    @options.useUtf8           = @uint8()
    @options.extraUvSize       = @uint8()
    @options.vertexIndexSize   = @uint8()
    @options.textureIndexSize  = @uint8()
    @options.materialIndexSize = @uint8()
    @options.boneIndexSize     = @uint8()
    @options.morphIndexSize    = @uint8()
    @options.rigidIndexSize    = @uint8()
    @model.name                = @text()
    @model.nameEnglish         = @text()
    @model.comment             = @text()
    @model.commentEnglish      = @text()
    @model.vertices            = @arrayOf('vertex')
    @model.faces               = @arrayOf('face', 3)
    @model.textures            = @arrayOf('texture')
    @model.materials           = @arrayOf('material')
    @model.bones               = @arrayOf('bone')
    @model.morphs              = @arrayOf('morph')
    @model.frames              = @arrayOf('frame')
    @model.rigids              = @arrayOf('rigid')
    @model.joints              = @arrayOf('joint')
    @model

  # Consume 8bit as signed int.
  int8: () ->
    @index += 1
    @dataView.getInt8(@index - 1, true)

  # Consume 16bit as signed int.
  int16: () ->
    @index += 2
    @dataView.getInt16(@index - 2, true)

  # Consume 32bit as signed int.
  int32: () ->
    @index += 4
    @dataView.getInt32(@index - 4, true)

  # Consume 8bit as unsigned int.
  uint8: () ->
    @index += 1
    @dataView.getUint8(@index - 1, true)

  # Consume 16bit as unsigned int.
  uint16: () ->
    @index += 2
    @dataView.getUint16(@index - 2, true)

  # Consume 32bit as float.
  float: () ->
    @index += 4
    @dataView.getFloat32(@index - 4, true)

  # Consume 8bit and return a String as ASCII character.
  char: ()->
    String.fromCharCode(@uint8())

  # Return characters with a given size.
  chars: (size) ->
    @char() for [0...size]

  # Return characters as a String with a given size.
  string: (size) ->
    @chars(size).join('')

  # Return an Array of uint8 with a given size.
  bytes: () ->
    @uint8() for [0...@int32()]

  # Read a text block.
  # A text block consists of a size segment and a content segment.
  text: ->
    bytes = @bytes()
    codes = (bytes[i] + bytes[i + 1] * 256 for i in [0...bytes.length] by 2)
    String.fromCharCode.apply(null, codes)

  xyz: ->
    x: @float()
    y: @float()
    z: @float()

  xyzw: ->
    x: @float()
    y: @float()
    z: @float()
    w: @float()

  uv: ->
    u: @float()
    v: @float()

  rgb: ->
    r: @float()
    g: @float()
    b: @float()

  rgba: ->
    r: @float()
    g: @float()
    b: @float()
    a: @float()

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

  # Read an Array of the given data type.
  # For `faces`, we provide the `interval` option.
  # The `dataType` is one of `vertex`, `faces`, `texture`,
  # `material`, `bone`, `morph`, `frame`, `rigid`, `joint`.
  arrayOf: (dataType, interval = 1) ->
    @[dataType]() for [0...@int32() / interval]

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
    @uint8()

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

  face: ->
    [
      @vertexIndex()
      @vertexIndex()
      @vertexIndex()
    ]

  texture: ->
    @texturePath()

  texturePath: ->
    @text()

  material: ->
    name: @text()
    nameEnglish: @text()
    diffusion: @rgba()
    specular: @rgb()
    specularFactor: @float()
    ambient: @rgb()
    drawFlag: @uint8()
    edgeColor: @rgba()
    edgeSize: @float()
    normalTexture: @textureIndex()
    sphereIndex: @textureIndex()
    sphereMode: @uint8()
    toonTexture: @materialToonTexture()
    memo: @text()
    faceSize: @int32()

  materialToonTexture: ->
    switch @uint8()
      when 0 then @textureIndex()
      when 1 then @uint8()

  bone: ->
    object                 = {}
    object.name            = @text()
    object.nameEnglish     = @text()
    object.position        = @xyz()
    object.parentBone      = @boneIndex()
    object.transitionState = @int32()
    object.flags           = flags = @boneFlags()
    object.destination     = if flags.specifiedByIndex then @boneIndex() else @xyz()
    object.addedBone       = @boneIndex() if flags.useAddedRotation || flags.useAddedTranslation
    object.addedRate       = @float() if flags.useAddedRotation || flags.useAddedTranslation
    object.fixedAxis       = @xyz() if flags.useFixedAxis
    object.localAxisX      = @xyz() if flags.useLocalAxis
    object.localAxisZ      = @xyz() if flags.useLocalAxis
    object.key             = @int32() if flags.useParentTransform
    object.ikTargetBone    = @boneIndex() if flags.useIk
    object.ikLoop          = @int32() if flags.useIk
    object.ikLimit         = @float() if flags.useIk
    object.ikLinks         = @boneLinks() if flags.useIk
    object

  boneFlags: ->
    bits = @uint16()
    specifiedByIndex:     !!(bits & 0x0001)
    useRotation:          !!(bits & 0x0002)
    useTranslation:       !!(bits & 0x0004)
    displayed:            !!(bits & 0x0008)
    useControl:           !!(bits & 0x0010)
    useIk:                !!(bits & 0x0020)
    useAddedRotation:     !!(bits & 0x0100)
    useAddedTranslation:  !!(bits & 0x0200)
    useFixedAxis:         !!(bits & 0x0400)
    useLocalAxis:         !!(bits & 0x0800)
    usePhysicalTransform: !!(bits & 0x1000)
    useParentTransform:   !!(bits & 0x2000)

  boneLinks: ->
    (@boneLink() for [0...@int32()])

  boneLink: ->
    bone    = @boneIndex()
    limited = @uint8()
    bone: bone
    lowerLimit: @xyz() if limited
    upperLimit: @xyz() if limited

  morph: ->
    object              = {}
    object.name         = @text()
    object.nameEnglish  = @text()
    object.controlPanel = @uint8()
    object.type         = @uint8()
    object.records      = (@morphRecord(object.type) for [0...@int32()])
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
    calculationType: @uint8()
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

  frame: ->
    name: @text()
    nameEnglish: @text()
    specialFrameFlag: @uint8()
    elements: @frameElements()

  frameElements: ->
    @frameElement() for [0...@int32()]

  frameElement: ->
    if @uint8()
      @morphIndex()
    else
      @boneIndex()

  rigid: ->
    name: @text()
    nameEnglish: @text()
    boneIndex: @boneIndex()
    group: @uint8()
    collisionGroupFlag: @uint16()
    shape: @uint8()
    size: @xyz()
    position: @xyz()
    rotation: @xyz()
    mass: @float()
    translationDecay: @float()
    rotationDecay: @float()
    bounce: @float()
    friction: @float()
    calculationType: @uint8()

  joint: ->
    name: @text()
    nameEnglish: @text()
    type: @uint8()
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
