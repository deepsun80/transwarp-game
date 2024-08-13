import * as THREE from 'three';

interface TubeProps {
  rotation: Number;
}

function TubeTest({ rotation }: TubeProps) {
  const geometry = new THREE.BufferGeometry();
  const geometryTwo = new THREE.BufferGeometry();
  const vertices = [];

  const circle = new THREE.TextureLoader().load('/circle.png');

  for (let count = 0; count < 100; count++) {
    const x = 100 * Math.random() - 50;
    const y = 100 * Math.random() - 50;
    const z = 100 * Math.random() - 50;

    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  // console.log('vertices', vertices);
  // console.log(
  //   'vertices float32',
  //   new THREE.Float32BufferAttribute(vertices, 3)
  // );
  console.log('geometry', geometry);

  /** ------ */
  let points = [];
  // Define points along Z axis
  // const yPoint = i > 2 && i < 8 ? Math.random() * 5 : 0;
  points.push(new THREE.Vector3(0, 0, 5));
  points.push(new THREE.Vector3(0, 0, 50));
  points.push(new THREE.Vector3(0, 0, 75));
  points.push(new THREE.Vector3(0, 0, 100));

  const path = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(path, 20, 50, 64, false);
  // console.log('tubeGeometry vertices', tubeGeometry.attributes.position.array);

  // const tubeBufferGeometry = tubeGeometry;
  geometryTwo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(tubeGeometry.attributes.position.array, 3)
  );
  console.log('geometryTwo', geometryTwo);

  return (
    <group>
      {/* <mesh
        geometry={tubeGeometry}
        // material={material}
      >
        <meshStandardMaterial
          color={'lightgrey'}
          side={2}
          // transparent
          // opacity={0.3}
        />
      </mesh> */}
      <points args={[geometryTwo]}>
        <pointsMaterial
          size={10}
          sizeAttenuation={true}
          map={circle}
          alphaTest={0.5}
          transparent={true}
        />
      </points>
    </group>
  );
}

export default TubeTest;
