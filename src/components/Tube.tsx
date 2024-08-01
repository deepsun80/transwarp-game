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
    for (let i = 0; i < 250; i += 1) {
      const yPoint = i > 2 && i < 248 ? Math.random() * 25 : 0;
      points.push(new THREE.Vector3(0, yPoint, -10 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  });

  return (
    <mesh rotation-y={rotation}>
      <tubeGeometry args={[curve, 2000, 10, 50, false]} />
      <meshStandardMaterial color={'lightgrey'} side={2} />
    </mesh>
  );
}

export default Tube;
