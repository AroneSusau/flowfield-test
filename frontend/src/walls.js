import three, * as THREE from './../libs/three.js'
import * as Materials from './materials.js'

export function SetupWalls(scene, geometry) {    
    const walls = [
        new THREE.Mesh( geometry.clone(), Materials.BlueMaterial ),
        new THREE.Mesh( geometry.clone(), Materials.BlueMaterial ),
        new THREE.Mesh( geometry.clone(), Materials.BlueMaterial ),
        new THREE.Mesh( geometry.clone(), Materials.BlueMaterial ),
    ]

    const wallPos = [new THREE.Vector3(10.5,-0.5,0), new THREE.Vector3(0,-0.5,10.5)]
    const wallGeo = [new THREE.Vector3(1,1,20), new THREE.Vector3(20,1,1)]

    walls.forEach((w, i) => {
        scene.add( w )

        const oneg = i > 1 ? -1 : 1
        const neg = oneg * -1
        
        const pos = wallPos[i % 2]
        const geo = wallGeo[i % 2]

        w.position.set(neg * pos.x, pos.y, oneg * pos.z)
        w.geometry.scale(geo.x, geo.y, geo.z)
    })
}