import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GradientTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Tube() {
  const meshRef = useRef();
  const [stops, setStops] = useState([0.01, 0.02, 0.03, 1]);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
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

  useFrame(() => {
    setStops((prevStops) => {
      const newStops = prevStops.map((stop, index) =>
        index < prevStops.length - 1 ? (stop + 0.01) % 1 : 1
      );
      return newStops;
    });
  });

  // Define the path for the tube geometry
  const path = new THREE.CurvePath();
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0)
    )
  );

  // Create the tube geometry
  const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial>
        <GradientTexture
          stops={stops}
          colors={['red', 'blue', 'white', 'white']}
          size={1024}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Tube />
    </Canvas>
  );
}

export default App;
