# Control model and three.js.
#
# ```
# parser     = new Parser(arrayBuffer)
# model      = parser.parse()
# controller = new Controller(model)
# controller.render()
# ```
class this.Controller

  # Prepare objects to render 3D world.
  #
  # ```
  # @model - an Object parsed by Parser.
  # ```
  constructor: (@model) ->
    @width    = window.innerWidth
    @height   = window.innerHeight
    @renderer = @createRenderer()
    @scene    = @createScene()
    @camera   = @createCamera()
    @vertexes = @createVertexes()

  # Put canvas object, and start rendering loop.
  render: ->
    document.body.appendChild(@renderer.domElement)
    @scene.add(@camera)
    @scene.add(vertex) for vertex in @vertexes
    @renderer.render(@scene, @camera)

  # Update world by recursion.
  # This is a process invoked in each frame.
  animate: ->
    window.requestAnimationFrame => @animate()
    @renderer.render(@scene, @camera)

  # Create a renderer required to render world.
  createRenderer: ->
    renderer = new THREE.WebGLRenderer(antialias: true)
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
    camera.position.z = 1000
    camera

  # Create meshes representing the vertexes of MMD model.
  # Due to the performance reason, we don't render all of vertexes.
  # This is adjusted by the value `interval`.
  createVertexes: ->
    interval          = 100
    enlargementFactor = 30
    meshColor         = 0xff0000
    for vertex in @model.vertexes by interval
      geometry = new THREE.SphereGeometry(1)
      material = new THREE.MeshBasicMaterial(color: meshColor, wireframe: true)
      mesh     = new THREE.Mesh(geometry, material)
      mesh.position.set(
        vertex.position[0] * enlargementFactor,
        vertex.position[1] * enlargementFactor,
        vertex.position[2] * enlargementFactor
      )
      mesh
