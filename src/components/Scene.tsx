import { useContext, useRef, useEffect } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

import Tube from './Tube';
import Player from './Player';
// import PlayerStatic from './PlayerStatic';
// import StartText from './StartText';
// import Lights from './Lights';

import { AppContext } from '../context/AppContext';

function Scene() {
  const appContext = useContext(AppContext);
  const gameStart = appContext?.gameStart;
  const toggleGameStart = appContext?.toggleGameStart;

  const planesTopRef = useRef([]);
  const planesBottomRef = useRef([]);

  useEffect(() => {
    if (!gameStart) {
      setTimeout(() => {
        toggleGameStart(true);
      }, 600);
    }
  }, [gameStart]);

  return (
    <>
      {/* Lights */}
      {/* <Lights /> */}

      {/* Geometry */}
      <Tube
        rotation={0}
        planesTopRef={planesTopRef}
        planesBottomRef={planesBottomRef}
      />

      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshStandardMaterial color={'lightgrey'} />
      </mesh>

      {/* Game Logic */}
      {gameStart ? (
        <Player
          startPosition={[0, 0, -6250]}
          planesTopRef={planesTopRef}
          planesBottomRef={planesBottomRef}
        />
      ) : null}

      {/* {!gameStart && <StartText timer={timer} />} */}

      {/* Optional */}
      {/* <OrbitControls /> */}
      <Environment preset='park' />
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
