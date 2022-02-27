import three, * as THREE from './../libs/three.js'

function createPathStrings() {
    const basePath = `/assets/skybox/`
    const fileType = '.jpg'
    const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
    const pathStings = sides.map(side => {
      return basePath + side + fileType
    })
  
    return pathStings
}

function createMaterialArray() {
    const skyboxImagepaths = createPathStrings();
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    });
    return materialArray;
}

export function SetupSkybox(scene) {
    const materialArray = createMaterialArray();
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skybox = new THREE.Mesh(skyboxGeo, materialArray);
    
    skybox.position.set(0, 200, 0)

    scene.add(skybox);
}