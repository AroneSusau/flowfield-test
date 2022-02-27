import three, * as THREE from './libs/three.js'
import { PointerLockControls } from './libs/PointerLockControls.js'

import { SetupLighting } from './src/lighting.js'
import { SetupWalls } from './src/walls.js'
import { SetupFloor } from './src/floor.js'

import { SetupSkybox } from './src/skybox.js'

import * as Materials from './src/materials.js'

let x = io.connect("http://localhost:3000")

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const cameraSpeed = 4

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})

renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

SetupLighting( scene )
SetupWalls( scene, new THREE.BoxGeometry() )
SetupFloor( scene, new THREE.BoxGeometry() )

SetupSkybox( scene )

const player = new THREE.Mesh( new THREE.BoxGeometry(), Materials.RedMaterial)
scene.add( player )

const controls = new PointerLockControls( camera, renderer.domElement )
const clock = new THREE.Clock()

const buttons = {}
const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']

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

  player.position.set(camera.position.x, camera.position.y, camera.position.z)
  player.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z)

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