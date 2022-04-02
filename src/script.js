import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import Stats from 'stats.js'
import * as Perlin from './perlin'

// Canvas
const canvas = document.querySelector('canvas')

// Scene
const scene = new THREE.Scene()

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.left = 0
    camera.right = sizes.width,
    camera.top = sizes.height,
    camera.bottom = 0


    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.OrthographicCamera(0, sizes.width, sizes.height, 0, 1, 1000 )

camera.position.set(0, 0, 2)
scene.add(camera)

// Debug
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const gui = new dat.GUI()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()
let delta, elapsedTime = 0

const blue = new THREE.Color(103 / 255, 130 / 255, 194 / 255)
const purple = new THREE.Color(117 / 255, 107 / 255, 176 / 255)

const yellow = new THREE.Color(246 / 255, 237 / 255, 96 / 255)
const orange = new THREE.Color(253 / 255, 182 / 255, 78 / 255)

const gridDimension = 100
const gridBoxWidth = sizes.width / gridDimension
const gridBoxHeight = sizes.height / gridDimension
const grid = []

Perlin.seed( 1 + Math.floor(Math.random() * 65536) )

function Box(col, row, x, y, width, height) {
    this.width = width
    this.height = height

    this.halfWidth = width / 2
    this.halfHeight = height / 2
    
    this.angle = Perlin.perlin2(col, row) * 2 * Math.PI
    this.flow = new THREE.Vector2(
        Math.cos(this.angle) * this.halfWidth,
        Math.sin(this.angle) * this.halfHeight
    )

    const points = [];
    points.push( new THREE.Vector3( 0,  0, 0 ) );
    points.push( new THREE.Vector3( this.flow.x, this.flow.y, 0 ) );

    const a = new THREE.Color()
    const b = new THREE.Color()

    a.lerpColors(yellow, orange, this.flow.x)
    b.lerpColors(blue, purple, this.flow.y)

    this.color = new THREE.Color()
    this.color.lerpColors(a, b, 0.5)

    this.geometry = new THREE.BufferGeometry().setFromPoints( points );
    this.material = new THREE.MeshBasicMaterial({
        color: this.color,
    })

    this.mesh = new THREE.Line(this.geometry, this.material)

    this.mesh.position.set(x + width/2, y + height/2, 0)
    this.mesh.visible = true

    scene.add(this.mesh)
}

for (let row = 0; row < gridDimension; row++) {
    grid.push([])

    for (let col = 0; col < gridDimension; col++) {
        grid[row].push(new Box(
            col / gridDimension,
            row / gridDimension,
            col * gridBoxWidth, 
            row * gridBoxHeight, 
            gridBoxWidth, 
            gridBoxHeight
        ))
    }
}

let pointsGeom = new THREE.BufferGeometry()
const positions = [];
const count = 10000

for (let i = 0; i < count; i++) {
    positions.push(Math.random() * sizes.width)
    positions.push(Math.random() * sizes.height)
    positions.push(0)
}

pointsGeom.setAttribute("position", new THREE.Float32BufferAttribute( positions, 3 ))

let pointsMaterial = new THREE.PointsMaterial({
    size: 5,
    color: 0xffffff
})

let point = new THREE.Points(pointsGeom, pointsMaterial)

scene.add(point)


const tick = () => {

    const array = point.geometry.attributes["position"].array
    
    for (let i = 0; i < count; i++) {
        let i3 = i * 3
        let x = array[i3 + 0]
        let y = array[i3 + 1]

        let xIndex = Math.floor(x / gridBoxWidth)
        let yIndex = Math.floor(y / gridBoxHeight)
        let dir = grid[yIndex][xIndex].flow

        let speed = 3
        let dt = 5

        let start = new THREE.Vector2(x, y)
        let next = new THREE.Vector2(x + speed * dir.x, y + speed * dir.y)
        let final = start.lerp(next, delta * dt)

        let halfWidth = sizes.width / 2
        let halfHeight = sizes.height / 2

        if (final.x >= sizes.width - 1) {
            final.x = 1
            final.y = final.y < halfHeight ? final.y + halfHeight : final.y - halfHeight
        }
            
        if (final.x <= 0) {
            final.x = sizes.width - 2
            final.y = final.y < halfHeight ? final.y + halfHeight : final.y - halfHeight
        }

        if (final.y >= sizes.height - 1) {
            final.y = 1
            final.x = final.x < halfWidth ? final.x + halfWidth : final.x - halfWidth
        }

        if (final.y <= 0) {
            final.y = sizes.height - 2
            final.x = final.x < halfWidth ? final.x + halfWidth : final.x - halfWidth
        }

        array[i3 + 0] = final.x
        array[i3 + 1] = final.y
    }

    point.geometry.computeBoundingBox();
    point.geometry.computeBoundingSphere();
    point.geometry.attributes["position"].needsUpdate = true
}

const animate = () => {
    stats.begin()
    delta = clock.getDelta()
    elapsedTime = clock.getElapsedTime()

    tick()

    // Render
    renderer.render(scene, camera)

    stats.end();
    requestAnimationFrame(animate)
}

animate();
