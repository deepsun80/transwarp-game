import { useState } from 'react';
import { Grid, OrbitControls, Environment } from '@react-three/drei';
import Tube from './Tube';
import Player from './Player';

function Scene() {
  const [playerPosition, setPlayerPosition] = useState(0);

  return (
    <>
      {/* <Lights /> */}

      {/* Geometry */}
      <Tube rotation={0} playerPosition={playerPosition} />

      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshStandardMaterial color={'lightgrey'} />
      </mesh>

      <Player
        startPosition={[0, 0, -6200]}
        setPlayerPosition={setPlayerPosition}
      />

      {/* Optional */}
      <OrbitControls />
      <Environment preset='city' />
      <Grid
        sectionSize={3}
        sectionColor={'white'}
        sectionThickness={1}
        cellSize={1}
        cellColor={'#ececec'}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={100}
        fadeStrength={5}
      />
    </>
  );
}

export default Scene;
