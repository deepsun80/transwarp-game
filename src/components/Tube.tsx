import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GradientTexture, Edges } from '@react-three/drei';

interface TubeProps {
  rotation: Number;
}

interface TunnelProps {
  curve: any;
  position: Number;
  rotation: Number;
}

const Tunnel = ({ curve, position, rotation }: TunnelProps) => {
  const tubeRef = useRef();
  const edgesRef = useRef();

  const [stops, setStops] = useState([0, 0.005, 0.015, 0.02, 0.025, 1]);

  // Create tube geometry and modify vertices
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(curve, 750, 50, 32, false);

    return baseGeometry;
  }, [curve]);

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
        rotation-y={rotation}
        position-z={position}
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
              'red',
              'yellow',
              'lightgrey',
              'lightgrey',
            ]}
            // size={1024}
          />
        </meshStandardMaterial>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color='white' linewidth={5} />
        </lineSegments>
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
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 350 : 0;
      // const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(0, yPoint, -150 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const position = -10;

  return <Tunnel curve={curve} rotation={rotation} position={position} />;
}

export default Tube;
