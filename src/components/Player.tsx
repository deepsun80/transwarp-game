import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Controls, PLAYER_SPEED } from '../helpers';

import * as THREE from 'three';

interface PlayerProps {
  startPosition: number[];
}

function Player({ startPosition }: PlayerProps) {
  const playerRef = useRef();
  const [acc, setAcc] = useState(0);

  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);

  useFrame(({ pointer }) => {
    if (playerRef?.current) {
      playerRef.current.rotation.x =
        -pointer.y * 0.5 - THREE.MathUtils.degToRad(180);
    }
  });

  useFrame(() => {
    if (playerRef?.current && forwardPressed) {
      if (acc < PLAYER_SPEED) {
        playerRef.current.position.z += acc;
        setAcc(acc + 0.007);
      } else {
        playerRef.current.position.z += PLAYER_SPEED;
      }
    } else if (playerRef?.current && backPressed) {
      if (acc < PLAYER_SPEED) {
        playerRef.current.position.z -= acc;
        setAcc(acc + 0.007);
      } else {
        playerRef.current.position.z -= PLAYER_SPEED;
      }
    } else {
      setAcc(0);
    }
  });

  return (
    <mesh ref={playerRef} position={startPosition}>
      <boxGeometry />
      <meshStandardMaterial color={'pink'} />
    </mesh>
  );
}

export default Player;
