import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';

function TubeWithImages() {
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, -5, 5),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 5, 15),
      new THREE.Vector3(0, 10, 20),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 2, 8, false);
  }, [curve]);

  const randomPoints = useMemo(() => {
    const points = [];
    const count = 200; // Number of images
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/circle2.png');

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();

      const tangent = curve.getTangentAt(u);
      const normal = new THREE.Vector3(1, 0, 0); // Facing the x-axis (since the curve is on z-axis)
      const binormal = new THREE.Vector3()
        .crossVectors(tangent, normal)
        .normalize();

      const angle = 2 * Math.PI * v;
      const radius = tubeGeometry.parameters.radius;

      const point = curve.getPointAt(u);
      const position = point
        .clone()
        .add(normal.clone().multiplyScalar(Math.cos(angle) * radius))
        .add(binormal.clone().multiplyScalar(Math.sin(angle) * radius));

      points.push({ position, texture });
    }

    return points;
  }, [curve, tubeGeometry]);

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color='blue' wireframe={true} />
      </mesh>
      {randomPoints.map((point, i) => (
        <sprite
          key={i}
          position={point.position}
          scale={[0.2, 0.2, 1]} // Set scale of the sprite (width, height, depth)
        >
          <spriteMaterial map={point.texture} />
        </sprite>
      ))}
    </group>
  );
}

export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <TubeWithImages />
    </Canvas>
  );
}
