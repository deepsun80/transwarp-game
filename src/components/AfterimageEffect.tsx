import { useEffect, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, AfterimagePass } from 'three-stdlib';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

extend({ EffectComposer, RenderPass, AfterimagePass });

function AfterimageEffect({ target }: { target: any }) {
  const { gl, size, camera } = useThree();
  const composerRef = useRef();
  const targetScene = useRef(new THREE.Scene());
  const targetCamera = useRef(camera.clone());
  const renderTarget = useRef(
    new THREE.WebGLRenderTarget(size.width, size.height)
  );

  useEffect(() => {
    // Set up the target scene and add the target geometry
    if (target) {
      targetScene.current.add(target);
    }

    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(
      targetScene.current,
      targetCamera.current
    );
    composer.addPass(renderPass);

    const afterimagePass = new AfterimagePass();
    afterimagePass.uniforms['damp'].value = 0.96;
    composer.addPass(afterimagePass);

    composerRef.current = composer;
  }, [gl, target]);

  useEffect(() => {
    // Update render target size on window resize
    renderTarget.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    if (composerRef.current && target) {
      // Render the target scene with afterimage effect
      composerRef.current.render();
    }
  }, 1);

  return null;
}

export default AfterimageEffect;
