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
    @faces    = @createFaces()

  # Put canvas object, and start rendering loop.
  render: ->
    document.body.appendChild(@renderer.domElement)
    @scene.add(@camera)
    @scene.add(face) for face in @faces
    @renderer.render(@scene, @camera)

  # Update world by recursion.
  # This is a process invoked in each frame.
  animate: ->
    window.requestAnimationFrame => @animate()
    @renderer.render(@scene, @camera)

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
    camera.position.z = 1000
    camera

  # Create faces of MMD model.
  # Due to the performance reason, we don't render all of vertexes.
  # This is adjusted by the value `interval`.
  createFaces: ->
    interval          = 10
    enlargementFactor = 30
    for face in @model.faces by interval
      geometry = new THREE.Geometry()
      geometry.vertices = [
        new THREE.Vector3(
          @model.vertexes[face[0]].position.x * enlargementFactor,
          @model.vertexes[face[0]].position.y * enlargementFactor,
          @model.vertexes[face[0]].position.z * enlargementFactor
        ),
        new THREE.Vector3(
          @model.vertexes[face[1]].position.x * enlargementFactor,
          @model.vertexes[face[1]].position.y * enlargementFactor,
          @model.vertexes[face[1]].position.z * enlargementFactor
        ),
        new THREE.Vector3(
          @model.vertexes[face[2]].position.x * enlargementFactor,
          @model.vertexes[face[2]].position.y * enlargementFactor,
          @model.vertexes[face[2]].position.z * enlargementFactor
        ),
      ]
      geometry.faces.push(new THREE.Face3(0, 1, 2))
      geometry.computeFaceNormals()
      mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
      mesh
