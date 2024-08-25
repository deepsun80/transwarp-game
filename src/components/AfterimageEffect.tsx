import { useEffect, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, AfterimagePass } from 'three-stdlib';
import { useThree } from '@react-three/fiber';

extend({ EffectComposer, RenderPass, AfterimagePass });

function AfterimageEffect() {
  const { scene, camera, gl, size } = useThree();
  const composerRef = useRef();

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms['damp'].value = 0.75;
    composer.addPass(afterimagePass);
    composerRef.current = composer;
  }, [gl, scene, camera]);

  return null;
}

export default AfterimageEffect;
