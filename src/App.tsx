import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import { KeyboardControls } from '@react-three/drei';

function App() {
  const map = useMemo(
    () => [{ name: 'forward', keys: ['ArrowUp', 'KeyW'] }],
    []
  );

  return (
    <KeyboardControls map={map}>
      <Canvas camera={{ position: [0, 0, -9740], fov: 60, far: 2000 }}>
        {/* <Canvas camera={{ position: [100, 100, 100], fov: 60, far: 1000 }}> */}
        <Suspense fallback={'Loading...'}>
          <color attach='background' args={['#010b19']} />
          <Scene />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
