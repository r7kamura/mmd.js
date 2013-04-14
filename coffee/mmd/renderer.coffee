# Control parsed model data and THREE.js.
#
# ```
# model  = MMD.ModelParser.parse(modelArrayBuffer)
# motion = MMD.MotionParser.parse(motionArrayBuffer)
# MMD.Renderer.render(model, motion)
# ```
class MMD.Renderer
  # Utility function to construct and render.
  @render: (args...) ->
    new this(args...).render

  # Prepare objects to render 3D world.
  #
  # ```
  # @model  - an Object parsed by ModelParser.
  # @motion - an Object parsed by MotionParser.
  # @frame  - an Integer to count current frame number.
  # ```
  constructor: (@model, @motion) ->
    @width    = window.innerWidth
    @height   = window.innerHeight
    @renderer = @createRenderer()
    @scene    = @createScene()
    @camera   = @createCamera()
    @bones    = @createBones()
    @stats    = @createStats()
    @frame    = 0
    @addFaces()

  # Put canvas object, and start rendering loop.
  render: ->
    document.body.appendChild(@renderer.domElement)
    document.body.appendChild(@stats.domElement)
    @animate()

  # A function to be called in each frame.
  animate: ->
    window.requestAnimationFrame => @animate()
    @stats.update()
    @renderer.render(@scene, @camera)
    @incrementFrame()

  # Increment @frame count.
  incrementFrame: ->
    @frame += 1

  # Create a renderer object required to render world.
  createRenderer: ->
    renderer = new THREE.CanvasRenderer(antialias: true)
    renderer.setSize(@width, @height)
    renderer

  # Create a scene object required to render world.
  createScene: ->
    new THREE.Scene()

  # Create a camera object.
  createCamera: ->
    angleOfView       = 75
    aspect            = @width / @height
    clipNear          = 1
    clipFar           = 10000
    camera            = new THREE.PerspectiveCamera(angleOfView, aspect, clipNear, clipFar)
    camera.position.y = 20
    camera.position.z = -20
    camera.lookAt(x: 0, y: 10, z: 0)
    camera

  # Create faces of MMD model.
  # Due to the performance reason, we don't render all of faces.
  # This is adjusted by the value `interval`.
  addFaces: ->
    interval = 100
    for face in @model.faces by interval
      geometry = new THREE.Geometry()
      geometry.vertices = [
        @model.vertices[face[0]].position,
        @model.vertices[face[1]].position,
        @model.vertices[face[2]].position,
      ]
      geometry.faces.push(new THREE.Face3(0, 1, 2))
      geometry.computeFaceNormals()
      mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
      @scene.add(mesh)

  createBones: ->
    for bone in @model.bones
      geometry        = new THREE.SphereGeometry(0.1)
      material        = new THREE.MeshNormalMaterial()
      mesh            = new THREE.Mesh(geometry, material)
      mesh.position.x = bone.position.x
      mesh.position.y = bone.position.y
      mesh.position.z = bone.position.z
      mesh

  getTableFromBoneNameToBone: ->
    @tableFromBoneNameToBone ||= do =>
      table = {}
      table[bone.name] = bone for bone in @model.bones
      table

  createStats: ->
    new Stats()
