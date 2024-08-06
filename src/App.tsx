import { useMemo } from 'react';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { KeyboardControls } from '@react-three/drei';
import { Controls } from './helpers';

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      {/* <Canvas camera={{ position: [0, 0, -7390], fov: 60, far: 10000 }}> */}
      <Canvas camera={{ position: [0, 0, -7390], fov: 60, far: 600 }}>
        <Suspense fallback={'Loading...'}>
          <color attach='background' args={['#171720']} />
          <Scene />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
