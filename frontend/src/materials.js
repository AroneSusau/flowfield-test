import three, * as THREE from './../libs/three.js'

export const JadeMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0.07568, 0.61424, 0.07568),
    specular: new THREE.Color(0.633, 0.727811, 0.633),
    shininess: 10,
})

export const BlueMaterial = new THREE.MeshPhongMaterial({
    color: 'black',
    shininess: 100,
    transparent: true,
    opacity: 0.8,
})

export const RedMaterial = new THREE.MeshPhongMaterial({
    color: 'red',
    shininess: 100,
})