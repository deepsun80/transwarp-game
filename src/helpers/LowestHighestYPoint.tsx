import * as THREE from 'three';
import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useRef } from 'react';

function CurvedTube() {
  const tubeRef = useRef();

  // Define the path along the z-axis
  const path = new THREE.CurvePath();
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(2, 5, 0),
      new THREE.Vector3(0, 0, 10),
    ])
  );

  // Create the tube geometry
  const tubeGeometry = new THREE.TubeGeometry(path, 100, 3, 20, false);

  const [zCoordinate, setZCoordinate] = useState(-10);

  useFrame(() => {
    if (tubeRef.current) {
      // Access the tube geometry
      const geometry = tubeRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');

      // Example: Get the lowest y-coordinate for a specific z-coordinate (e.g., z = 0)
      // const zCoordinate = 0.1;
      let lowestY = Infinity;
      // let highestY = -Infinity;

      for (let i = 0; i < positionAttribute.count; i++) {
        // const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        const z = positionAttribute.getZ(i);

        if (Math.abs(z - zCoordinate) < 0.1 && y < lowestY) {
          // if (Math.abs(z - zCoordinate) < 0.1 && y > highestY) {
          lowestY = y;
        }
      }
      if (zCoordinate <= 10) setZCoordinate(zCoordinate + 0.1);
      console.log(`Lowest y-coordinate at z = ${zCoordinate}: ${lowestY}`);
    }
  });

  return (
    <mesh ref={tubeRef} geometry={tubeGeometry}>
      <meshBasicMaterial color='blue' />
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <OrbitControls />
      <CurvedTube />
      <Grid
        sectionSize={3}
        sectionColor={'black'}
        sectionThickness={1}
        cellSize={1}
        cellColor={'#ececec'}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={1000}
        fadeStrength={5}
      />
    </Canvas>
  );
}

export default App;
