import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, AfterimagePass } from 'three-stdlib';
import { Box } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

extend({ EffectComposer, RenderPass, AfterimagePass });

function MovingBox() {
  const boxRef = useRef();
  const speed = 0.01;

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.position.z += speed;
    }
  });

  return (
    <Box ref={boxRef} args={[1, 1, 1]}>
      <meshStandardMaterial color='hotpink' />
    </Box>
  );
}

function AfterimageEffect() {
  const { scene, camera, gl, size } = useThree();
  const composerRef = useRef();

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  React.useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms['damp'].value = 0.96;
    composer.addPass(afterimagePass);
    composerRef.current = composer;
  }, [gl, scene, camera]);

  return null;
}

function Scene() {
  return (
    <>
      <MovingBox />
      <AfterimageEffect />
    </>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <OrbitControls />
      <pointLight position={[10, 10, 10]} />
      <Scene />
    </Canvas>
  );
}
