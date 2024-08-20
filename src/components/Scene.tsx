import { useState, useContext, useRef } from 'react';
import { Grid, OrbitControls, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';

import Tube from './Tube';
import Player from './Player';
// import PlayerStatic from './PlayerStatic';
// import StartText from './StartText';
// import { AppContext } from '../context/AppContext';

function Scene() {
  // const appContext = useContext(AppContext);

  // const gameStart = appContext?.gameStart;
  // const toggleGameStart = appContext?.toggleGameStart;

  // const [timer, setTimer] = useState(2);
  const [playerRef, setPlayerRef] = useState(null);
  const planesRef = useRef([]);

  console.log('playerRef', playerRef);
  console.log('planesRef', planesRef);
  // useEffect(() => {
  //   if (!gameStart && timer > 0) {
  //     setTimeout(() => {
  //       setTimer(timer - 1);
  //     }, 1000);
  //   } else if (gameStart) setTimer(2);
  // }, [gameStart, timer]);

  // useEffect(() => {
  //   if (timer <= 0) {
  //     setTimeout(() => {
  //       toggleGameStart(true);
  //     }, 1000);
  //   }
  // }, [timer]);

  useFrame(() => {
    if (playerRef && planesRef?.current?.length) {
      // Check for intersections with planes
      planesRef.current.forEach((plane: any, index: number) => {
        const box = new THREE.Box3().setFromObject(playerRef);
        const planeBox = new THREE.Box3().setFromObject(plane);

        if (box.intersectsBox(planeBox)) {
          console.log(`intersected with plane ${index + 1}`);
        }
      });
    }
  });

  return (
    <>
      {/* <Lights /> */}

      {/* Geometry */}
      <Tube rotation={0} planesRef={planesRef} />

      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshStandardMaterial color={'lightgrey'} />
      </mesh>

      <Player startPosition={[0, 0, -6200]} setPlayerRef={setPlayerRef} />

      {/* {!gameStart && <StartText timer={timer} />} */}

      {/* Optional */}
      {/* <OrbitControls /> */}
      <Environment preset='city' />
      {/* <Grid
        sectionSize={30}
        sectionColor={'white'}
        sectionThickness={1}
        cellSize={1}
        cellColor={'#ececec'}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={10000}
        fadeStrength={5}
      /> */}
    </>
  );
}

export default Scene;
