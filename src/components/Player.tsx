import { useRef, useState, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Controls, Speed } from '../helpers';
import { AppContext } from '../context/AppContext';

// import DissolveMaterial from './DissolveMaterial';

import * as THREE from 'three';

interface PlayerProps {
  startPosition: number[];
  planesTopRef: React.RefObject<HTMLSelectElement>;
  planesBottomRef: React.RefObject<HTMLSelectElement>;
}

// const boxMaterial = new THREE.MeshStandardMaterial({ color: 'white' });

function Player({ startPosition, planesTopRef, planesBottomRef }: PlayerProps) {
  const appContext = useContext(AppContext);
  const gameStart = appContext?.gameStart;
  const toggleGameStart = appContext?.toggleGameStart;

  const playerRef = useRef(null);
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const [acc, setAcc] = useState(0);
  const [playerFreeze, setPlayerFreeze] = useState(false);

  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);

  // Player and camera rotation based on mouse pointer
  useFrame(({ pointer }) => {
    // Freeze player before restarting
    if (playerFreeze) return;

    // Set rotation of player to 0 when starting
    if (!gameStart && playerRef?.current) {
      // container.current.rotation.x = THREE.MathUtils.degToRad(0);
      playerRef.current.rotation.x = 0;
      return;
    }

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

  // Player movement and collision detection
  useFrame(() => {
    const { PlayerSpeed, Acceleration } = Speed;
    const forward = new THREE.Vector3();

    // Move player forward after freeze
    if (playerFreeze && container?.current && playerRef?.current) {
      const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
      playerRef.current.getWorldDirection(forward);
      playerRef.current.position.add(forward.multiplyScalar(velocity.z));
      return;
    }

    // If game starting place container and player positions to start
    if (!gameStart && container?.current && playerRef?.current) {
      container.current.position.set(0, 0, 0);
      playerRef.current.position.set(0, 0, -6200);
      return;
    }

    // Player movement
    if (container?.current && playerRef?.current && forwardPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.add(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
      } else {
        const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
        playerRef.current.getWorldDirection(forward);
        container.current.position.add(forward.multiplyScalar(velocity.z));
      }
    } else if (container?.current && backPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
      } else {
        const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));
      }
    } else {
      setAcc(0);
    }
  });

  // Position camera relative to player
  useFrame(({ camera }) => {
    // Freeze player before restarting
    // if (playerFreeze) return;

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.5);

    if (cameraTarget?.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.5);

      camera.lookAt(cameraLookAt.current);
    }
  });

  // Check if player intersects any of the collision boxes, and set game logic
  useFrame((_state, delta) => {
    const combinedPlanes = [
      ...planesTopRef.current,
      ...planesBottomRef.current,
    ];
    combinedPlanes.forEach((plane: any, index: number) => {
      const box = new THREE.Box3().setFromObject(playerRef.current);
      const planeBox = new THREE.Box3().setFromObject(plane);
      if (box.intersectsBox(planeBox)) {
        setPlayerFreeze(true);

        setTimeout(() => {
          toggleGameStart(false);
        }, 350);
      }
    });
  });

  return (
    <group ref={container}>
      <group ref={cameraTarget} position-z={startPosition[2] + 1.5} />
      <group ref={cameraPosition} position-z={startPosition[2] - 5} />
      <mesh ref={playerRef} position={startPosition}>
        <boxGeometry />
        <meshStandardMaterial color={'pink'} />
        {/* <DissolveMaterial baseMaterial={boxMaterial} visible={!playerFreeze} /> */}
      </mesh>
    </group>
  );
}

export default Player;
