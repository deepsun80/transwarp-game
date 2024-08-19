import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0.8] }}>
      <Suspense fallback={'Loading...'}>
        <color attach='background' args={['#171720']} />
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default App;
