import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GradientTexture, Edges } from '@react-three/drei';

interface TubeProps {
  rotation: Number;
}

// Define the GLSL shader material
// const RadialGradientMaterial = shaderMaterial(
//   { time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },
//   // Vertex Shader
//   `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
//   `,
//   // Fragment Shader
//   `
//   varying vec2 vUv;
//   void main() {
//     vec2 uv = vUv * 2.0 - 1.0;
//     float len = length(uv);
//     vec3 color = vec3(0.0);

//     if (len < 0.2) {
//       color = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), len / 0.2);
//     } else if (len < 0.4) {
//       color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (len - 0.2) / 0.2);
//     } else if (len < 0.6) {
//       color = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (len - 0.4) / 0.2);
//     } else if (len < 0.8) {
//       color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), (len - 0.6) / 0.2);
//     } else {
//       color = vec3(1.0, 1.0, 1.0);
//     }

//     gl_FragColor = vec4(color, 1.0);
//   }
//   `
// );

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
  const edgesRef = useRef();

  const [stops, setStops] = useState([
    0.0001, 0.001, 0.005, 0.01, 0.02, 0.025, 1,
  ]);
  // const matRef = useRef();

  // Create tube geometry and modify vertices with twist
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(curve, 750, 50, 6, false);

    // Apply twist to geometry
    // applyTwist(baseGeometry, twistAngle);

    return baseGeometry;
  }, [curve, twistAngle]);

  // extend({ RadialGradientMaterial });
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry);
  }, [curve, twistAngle]);

  // Change UV direction of tube
  useEffect(() => {
    if (tubeRef.current) {
      const geometry = tubeRef.current.geometry;
      const uvs = geometry.attributes.uv.array;

      // Modify UVs to apply the gradient around the circumference
      for (let i = 0; i < uvs.length; i += 2) {
        const x = uvs[i];
        const y = uvs[i + 1];
        uvs[i] = y; // Swap x and y to rotate the texture
        uvs[i + 1] = x;
      }

      geometry.attributes.uv.needsUpdate = true;
    }
  }, [stops]);

  useEffect(() => {
    if (edgesRef?.current) {
      edgesRef.current.parent.geometry.parameters.radius = 35;
      console.log(edgesRef.current);
    }
  }, [edgesRef]);

  return (
    <group>
      <mesh
        ref={tubeRef}
        geometry={geometry}
        // material={material}
        // rotation-y={rotation}
        // position-z={position}
      >
        <bufferGeometry attach='geometry' {...geometry} />
        <meshStandardMaterial
          color='transparent'
          side={2}
          transparent
          opacity={1}
        >
          <GradientTexture
            stops={stops}
            colors={[
              'black',
              'blue',
              'violet',
              'red',
              'yellow',
              'lightgrey',
              'lightgrey',
            ]}
            // size={1024}
          />
        </meshStandardMaterial>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color='white' />
        </lineSegments>
        {/* <Edges color='yellow' linewidth={1} ref={edgesRef} threshold={1} /> */}
      </mesh>
      {/* <points geometry={new THREE.TubeGeometry(curve, 750, 50, 6, false)}>
        <pointsMaterial
          size={3}
          sizeAttenuation
          color={'white'}
          // attach='material'
          // map={pointImg}
          // transparent={false}
          // alphaTest={0.5}
          // opacity={1}
        />
      </points> */}
    </group>
  );
};

function Tube({ rotation }: TubeProps) {
  // Create a curve based on the points
  const curve = useMemo(() => {
    // Create an empty array to stores the points
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 300 : 0;
      const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(0, yPoint, -150 * i));
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
