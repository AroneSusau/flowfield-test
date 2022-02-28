import three, * as THREE from './../libs/three.js'
import * as Materials from './materials.js'

export function SetupFloor(scene, geometry) {
    const floor = new THREE.Mesh( geometry.clone(), Materials.JadeMaterial )
    scene.add( floor )

    floor.position.set(0, -1, 0)
    floor.geometry.scale(20, 0.001, 20)
}