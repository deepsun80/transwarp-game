import { Grid, OrbitControls, Environment } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { SimpleShaderMaterial } from './SimpleShaderMaterial';

// import Lights from './Lights';

extend({
  SimpleShaderMaterial,
});

function Scene() {
  return (
    <>
      {/* <Lights /> */}

      {/* Geometry */}
      {Array.from({ length: 90 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 0.2]}>
          <planeGeometry args={[3, 3]} />
          <simpleShaderMaterial
            uLevel={i / 30}
            // ref={(ref) => (frameRefs.current['right01'] = ref)}
          />
        </mesh>
      ))}

      {/* Optional */}
      <OrbitControls />
      <Environment preset='sunset' />
      {/* <Grid
        sectionSize={3}
        sectionColor={'white'}
        sectionThickness={1}
        cellSize={1}
        cellColor={'#ececec'}
        cellThickness={0.6}
        infiniteGrid
        fadeDistance={100}
        fadeStrength={5}
      /> */}
    </>
  );
}

export default Scene;
