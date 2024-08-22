import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import DissolveMaterial from './DissolveMaterial';

import * as THREE from 'three';

interface PlayerStaticProps {
  startPosition: number[];
}

function PlayerStatic({ startPosition }: PlayerStaticProps) {
  const playerRef = useRef();
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  // Position camera relative to player
  useFrame(({ camera }) => {
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.5);

    if (cameraTarget?.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.5);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <group ref={container}>
      <group ref={cameraTarget} position-z={startPosition[2] + 1.5} />
      <group ref={cameraPosition} position-z={startPosition[2] - 5} />
      <mesh ref={playerRef} position={startPosition}>
        <boxGeometry />
        <meshStandardMaterial color={'pink'} />
      </mesh>
    </group>
  );
}

export default PlayerStatic;
