class this.Controller
  constructor: (@model) ->
    @width    = window.innerWidth
    @height   = window.innerHeight
    @renderer = @createRenderer()
    @scene    = @createScene()
    @camera   = @createCamera()
    @vertexes = @createVertexes()
    @scene.add(@camera)

  render: ->
    document.body.appendChild(@renderer.domElement)
    @animate()

  animate: ->
    window.requestAnimationFrame => @animate()
    @renderer.render(@scene, @camera)

  createRenderer: ->
    renderer = new THREE.WebGLRenderer(antialias: true)
    renderer.setSize(@width, @height)
    renderer

  createScene: ->
    new THREE.Scene()

  createCamera: ->
    camera = new THREE.PerspectiveCamera(75, @width / @height, 1, 10000)
    camera.position.z = 1000
    camera

  createVertexes: ->
    for vertex in @model.vertexes by 10
      geometry = new THREE.SphereGeometry(1)
      material = new THREE.MeshBasicMaterial(color: 0xff0000, wireframe: true)
      mesh     = new THREE.Mesh(geometry, material)
      mesh.position.set(
        vertex.position[0] * 30,
        vertex.position[1] * 30,
        vertex.position[2] * 30
      )
      @scene.add(mesh)
