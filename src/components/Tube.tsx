import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GradientTexture, Edges } from '@react-three/drei';

interface TubeProps {
  rotation: Number;
}

// Twist function from the article
const applyTwist = (geometry, angle) => {
  const quaternion = new THREE.Quaternion();
  const positionAttribute = geometry.attributes.position;

  const vector = new THREE.Vector3();
  for (let i = 0; i < positionAttribute.count; i++) {
    vector.fromBufferAttribute(positionAttribute, i);

    const yPos = vector.z;
    const twistAngle = angle * yPos;

    quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), twistAngle);
    vector.applyQuaternion(quaternion);

    positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
  }

  geometry.attributes.position.needsUpdate = true;
};

const Tunnel = ({ curve, twistAngle, position, rotation }) => {
  const tubeRef = useRef();

  const [stops, setStops] = useState([0, 0.005, 0.015, 0.02, 0.025, 1]);
  // const matRef = useRef();
  const colors = ['violet', 'blue', 'green', 'yellow', 'orange', 'red'].map(
    (color) => new THREE.Color(color)
  );

  // Create tube geometry and modify vertices with twist
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(curve, 2000, 55, 32, false);

    // Apply twist to geometry
    // applyTwist(baseGeometry, twistAngle);
    const colorArray = new Float32Array(
      baseGeometry.attributes.position.count * 3
    );

    const indexArray = baseGeometry.index.array;

    // Assign random colors to each face
    for (let i = 0; i < indexArray.length; i += 3) {
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let j = 0; j < 3; j++) {
        color.toArray(colorArray, indexArray[i + j] * 3);
      }
    }

    baseGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colorArray, 3)
    );

    return baseGeometry;
  }, [curve, twistAngle]);

  // Change UV direction of tube
  // useEffect(() => {
  //   if (tubeRef.current) {
  //     const geometry = tubeRef.current.geometry;
  //     const uvs = geometry.attributes.uv.array;

  //     // Modify UVs to apply the gradient around the circumference
  //     for (let i = 0; i < uvs.length; i += 2) {
  //       const x = uvs[i];
  //       const y = uvs[i + 1];
  //       uvs[i] = y; // Swap x and y to rotate the texture
  //       uvs[i + 1] = x;
  //     }

  //     geometry.attributes.uv.needsUpdate = true;
  //   }
  // }, []);

  // useEffect(() => {
  //   if (edgesRef?.current) {
  //     edgesRef.current.parent.geometry.parameters.radius = 35;
  //   }
  // }, [edgesRef]);

  return (
    <group>
      <mesh
        ref={tubeRef}
        geometry={geometry}
        rotation-y={rotation}
        position-z={position}
      >
        <bufferGeometry attach='geometry' {...geometry} />
        <meshStandardMaterial
          vertexColors
          // color='transparent'
          side={THREE.DoubleSide}
          // transparent
          // opacity={1}
        />
        {/*<meshStandardMaterial
          color='transparent'
          side={THREE.BackSide}
          transparent
          opacity={1}
        >
          <GradientTexture
            stops={stops}
            colors={[
              '#010b19',
              'blue',
              'red',
              'yellow',
              'lightgrey',
              'lightgrey',
            ]}
            // size={1024}
          />
        </meshStandardMaterial>*/}
        {/* <lineSegments geometry={geometry}>
          <lineBasicMaterial color='white' linewidth={5} />
        </lineSegments> */}
      </mesh>
    </group>
  );
};

function Tube({ rotation }: TubeProps) {
  // Create a curve based on the points
  const curve = useMemo(() => {
    // Create an empty array to stores the points
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 20; i += 1) {
      // let yPoint = 0;
      // if (i > 1 && i < 18 && i % 2 == 0) {
      //   yPoint = 400;
      // }
      const yPoint = i > 1 && i < 18 ? Math.random() * 400 : 0;
      // const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(0, yPoint, -325 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const twistAngle = Math.PI / 1000; // Twist angle
  const position = -10;

  return (
    // <mesh rotation-y={rotation} position-z={-10}>
    //   <tubeGeometry args={[curve, 1000, 50, 6, false]} />
    //   <meshStandardMaterial color={'lightgrey'} side={2} wireframe />
    // </mesh>
    <Tunnel
      curve={curve}
      twistAngle={twistAngle}
      rotation={rotation}
      position={position}
    />
  );
}

export default Tube;
