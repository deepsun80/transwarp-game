import { useRef, useState, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Controls, Speed } from '../helpers';
import { useForwardRaycast } from '../helpers/useForwardRaycast';
import { AppContext } from '../context/AppContext';

import * as THREE from 'three';

interface PlayerProps {
  startPosition: number[];
  setPlayerPosition: (args: Number) => void;
}

function Player({ startPosition, setPlayerPosition }: PlayerProps) {
  const playerRef = useRef();
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const appContext = useContext(AppContext);

  const gameStart = appContext?.gameStart;
  const toggleGameStart = appContext?.toggleGameStart;

  const raycast = useForwardRaycast(playerRef);

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const [acc, setAcc] = useState(0);

  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);

  // Player rotation based on mouse pointer
  useFrame(({ pointer }) => {
    // Set rotation of player to 0 when starting
    // if (!gameStart && container?.current && playerRef?.current) {
    //   container.current.rotation.x = THREE.MathUtils.degToRad(0);
    //   playerRef.current.rotation.x = THREE.MathUtils.degToRad(0);
    //   return;
    // }

    if (playerRef?.current && gameStart) {
      playerRef.current.rotation.x = THREE.MathUtils.lerp(
        playerRef.current.rotation.x,
        -pointer.y * 1 - THREE.MathUtils.degToRad(180),
        0.1
      );
    }

    if (cameraTarget?.current && cameraPosition?.current && gameStart) {
      cameraTarget.current.position.y = pointer.y * 2;
      cameraPosition.current.position.y = -pointer.y * 2;
    }
  });

  // Player movement and collision detection
  useFrame(() => {
    // If game starting place container and player positions to start
    if (!gameStart && container?.current && playerRef?.current) {
      container.current.position.set(0, 0, 0);
      playerRef.current.position.set(0, 0, -6200);
      return;
    }

    const { PlayerSpeed, Acceleration } = Speed;
    const forward = new THREE.Vector3();

    // Player movement
    if (container?.current && playerRef?.current && forwardPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.add(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
        setPlayerPosition(container.current.position.z);
      } else {
        const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
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
        const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));
        setPlayerPosition(container.current.position.z);
      }
    } else {
      setAcc(0);
    }

    // Collision detection
    const intersections = raycast();
    if (intersections?.length > 2 && gameStart) {
      console.log(intersections);
      toggleGameStart(false);
    }
    // console.log('intersections', intersections);
  });

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

export default Player;
