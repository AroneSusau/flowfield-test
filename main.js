import three, * as THREE from './libs/three.js'
import { PointerLockControls } from './libs/PointerLockControls.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const cameraSpeed = 4

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})

renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
directionalLight.position.set(100, 100, 100)

scene.add( directionalLight )

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2)
scene.add( ambientLight )

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshPhongMaterial({
  color: 'blue',
  shininess: 100,
  opacity: 0.5,
  transparent: true,
})

const materialJade = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0.07568, 0.61424, 0.07568),
  specular: new THREE.Color(0.633, 0.727811, 0.633),
  shininess: 10,
})

const cube = new THREE.Mesh( geometry, material )
const floor = new THREE.Mesh( geometry.clone(), materialJade )
scene.add( cube )
scene.add( floor )

floor.position.set(0, -2, 0)
floor.geometry.scale(100, 1, 100)
camera.position.z = 5

const controls = new PointerLockControls( camera, renderer.domElement )
const clock = new THREE.Clock()

const buttons = {}
const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD']

document.addEventListener('keydown', e => {
  keys.forEach(k => {
    if (k == e.code)
      buttons[k] = true
  })
})

document.addEventListener('keyup', e => {
  keys.forEach(k => {
    if (k == e.code)
      buttons[k] = false
  })
})

document.addEventListener('click', (e) => {
  controls.lock()
})

function animate() {
  requestAnimationFrame( animate )
  const delta = clock.getDelta()
  const cameraDelta = cameraSpeed * delta

  renderer.render( scene, camera )

  cube.rotateX(0.5 * delta)
  cube.rotateZ(0.5 * delta)

  if (buttons['KeyW'])
    controls.moveForward(cameraDelta)
  if (buttons['KeyA'])
    controls.moveRight(-cameraDelta)
  if (buttons['KeyS'])
    controls.moveForward(-cameraDelta)
  if (buttons['KeyD'])
    controls.moveRight(cameraDelta)
}

animate()