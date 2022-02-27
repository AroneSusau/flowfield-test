import three, * as THREE from './../libs/three.js'

export function SetupLighting(scene) {
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
    directionalLight.position.set(10, 50, 0)

    scene.add( directionalLight )

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2)
    scene.add( ambientLight )
}