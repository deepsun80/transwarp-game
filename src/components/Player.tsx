import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Controls, Speed } from '../helpers';

import * as THREE from 'three';

interface PlayerProps {
  startPosition: number[];
  setCameraPosition: (args: Number) => void;
  setPlayerPosition: (args: Number) => void;
}

function Player({
  startPosition,
  setCameraPosition,
  setPlayerPosition,
}: PlayerProps) {
  const playerRef = useRef();
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const [acc, setAcc] = useState(0);

  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);

  useFrame(({ pointer }) => {
    if (playerRef?.current) {
      playerRef.current.rotation.x = THREE.MathUtils.lerp(
        playerRef.current.rotation.x,
        -pointer.y * 1 - THREE.MathUtils.degToRad(180),
        0.1
      );
    }

    if (cameraTarget?.current && cameraPosition?.current) {
      cameraTarget.current.position.y = pointer.y * 2;
      cameraPosition.current.position.y = -pointer.y * 2;
    }
  });

  useFrame(() => {
    const { PlayerSpeed, Acceleration } = Speed;
    const forward = new THREE.Vector3();

    if (container?.current && playerRef?.current && forwardPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.add(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
        setPlayerPosition(container.current.position.z);
      } else {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.add(forward.multiplyScalar(velocity.z));
        setPlayerPosition(container.current.position.z);
      }
    } else if (container?.current && backPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
        setPlayerPosition(container.current.position.z);
      } else {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));
        setPlayerPosition(container.current.position.z);
      }
    } else {
      setAcc(0);
    }
  });

  useFrame(({ camera }) => {
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.5);

    if (cameraTarget?.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.5);

      camera.lookAt(cameraLookAt.current);
      setCameraPosition(
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)
          .z
      );
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

export default Player;
