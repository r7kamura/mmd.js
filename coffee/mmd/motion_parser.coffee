# Parse arrayBuffer as motion data in VMD format by Recursive Descendent Parsing style.
#
# ### data type
# VMD consists of an series of uint8, uint16, and float32.
#
# ### encoding
# The string in VMD format is encoded with Shift-JIS.
# We use sjis.js to decode these string.
#
# ### example
# ```
# motion = new MMD.MotionParser.parse(arrayBuffer)
# ```
class MMD.MotionParser
  # An utility function to parse.
  @parse: (args...) ->
    new this(args...).parse()

  # The constructor.
  #
  # ```
  # arrayBuffer - ArrayBuffer of binary model data
  # @dataView   - DataView object to read ArrayBuffer
  # @index      - Integer of a position for DataView
  # ```
  constructor: (arrayBuffer) ->
    @dataView = new DataView(arrayBuffer)
    @index    = 0

  # Parse motion data and return a parsed data object.
  parse: ->
    name1: @text(30)
    name2: @text(20)
    bones: @arrayOf('bone')
    morphs: @arrayOf('morph')
    cameras: @arrayOf('camera')
    lights: @arrayOf('light')
    shadows: @arrayOf('shadow')

  # Consume 8bit as unsigned int.
  uint8: () ->
    @index += 1
    @dataView.getUint8(@index - 1, true)

  # Consume 16bit as unsigned int.
  uint32: () ->
    @index += 4
    @dataView.getUint16(@index - 4, true)

  char: ->
    @uint8()

  chars: (size) ->
    @char() for [0...size]

  # Consume 32bit as float.
  float: () ->
    @index += 4
    @dataView.getFloat32(@index - 4, true)

  # Return an Array of uint8 with a given size.
  bytes: (size) ->
    @uint8() for [0...size]

  # Read a text block.
  text: (size) ->
    Sjis.fromArrayToString(@bytes(size))

  arrayOf: (dataType) ->
    @[dataType]() for [0...@uint32()]

  xyz: ->
    x: @float()
    y: @float()
    z: @float()

  xyzw: ->
    x: @float()
    y: @float()
    z: @float()
    w: @float()

  rgb: ->
    r: @float()
    g: @float()
    b: @float()

  bone: ->
    name: @text(15)
    frame: @uint32()
    position: @xyz()
    quaternion: @xyzw()
    interporation: @chars(64)

  morph: ->
    name: @text(15)
    frame: @uint32()
    value: @float()

  camera: ->
    name: @text(15)
    frame: @uint32()
    value: @float()
    distance: @float()
    position: @xyz()
    rotation: @xyz()
    interporation: @chars(24)
    angle: @uint32()
    perspective: @char()

  light: ->
    frame: @uint32()
    color: @rgb()
    position: @xyz()

  shadow: ->
    frame: @uint32()
    type: @char()
    distance: @float()
