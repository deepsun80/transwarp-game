import { useState } from 'react';
import * as THREE from 'three';

interface TubeProps {
  rotation: Number;
}

function Tube({ rotation }: TubeProps) {
  // Create a curve based on the points
  const [curve] = useState(() => {
    // Create an empty array to stores the points
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 300 : 0;
      points.push(new THREE.Vector3(0, yPoint, -150 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  });

  return (
    <mesh rotation-y={rotation} position-z={-10}>
      <tubeGeometry args={[curve, 1000, 50, 50, false]} />
      <meshStandardMaterial color={'lightgrey'} side={2} />
    </mesh>
  );
}

export default Tube;
