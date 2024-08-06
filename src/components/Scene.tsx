import { Grid, OrbitControls, Environment } from '@react-three/drei';

// import Lights from './Lights';
import Tube from './Tube';
import Player from './Player';

function Scene() {
  return (
    <>
      {/* <Lights /> */}

      {/* Geometry */}
      <Tube rotation={0} />

      <mesh>
        <sphereGeometry args={[50, 32, 16]} />
        <meshStandardMaterial color={'lightgrey'} />
      </mesh>

      <Player startPosition={[0, 0, -7385]} />

      {/* Optional */}
      {/* <OrbitControls /> */}
      <Environment preset='studio' />
      <color attach='background' args={['lightgrey']} />
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
