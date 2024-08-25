import { useState } from 'react';

import * as THREE from 'three';

function Lights() {
  const [o] = useState(() => new THREE.Object3D());

  return (
    <group>
      <ambientLight intensity={0.5} />
      {/* <hemisphereLight
        skyColor={'red'} // Sky color
        groundColor={'blue'} // Ground color
        intensity={1} // Intensity of the light
        position={[10, 10, 0]} // Position of the light
      /> */}
      <directionalLight
        position={[0, 0, 0]}
        color={'#ffffff'}
        intensity={5.5}
      />
      <primitive object={o} position={[0, 0, -6200]} />
    </group>
  );
}

export default Lights;
