import { useEffect, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, AfterimagePass } from 'three-stdlib';
import { useThree } from '@react-three/fiber';

extend({ EffectComposer, RenderPass, AfterimagePass });

function AfterimageEffect({ target }) {
  const { gl, size, scene, camera } = useThree();
  const composerRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    if (target) {
      targetRef.current = target;
      const composer = new EffectComposer(gl);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const afterimagePass = new AfterimagePass();
      afterimagePass.uniforms['damp'].value = 0.96;
      composer.addPass(afterimagePass);

      composerRef.current = composer;
    }
  }, [gl, scene, camera, target]);

  useFrame(() => {
    if (composerRef.current && targetRef.current) {
      // Ensure only the target geometry is affected
      const targetVisible = targetRef.current.visible;

      scene.children.forEach((child, index) => {
        if (child.children.length > 0) {
          // Is a group
          child.children.forEach((groupChild) => {
            if (groupChild?.geometry.type !== 'Box') {
              groupChild.visible = false;
            }
          });
        } else {
          if (child?.geometry.type !== 'Box') {
            child.visible = false;
          }
        }
        // if (index === 2 && child !== targetRef.current) {
        //   child.visible = false;
        // }
      });

      composerRef.current.render();

      // Restore visibility
      scene.children.forEach((child) => {
        if (child.children.length > 0) {
          // Is a group
          child.children.forEach((groupChild) => {
            if (groupChild?.geometry?.type !== 'Box') {
              groupChild.visible = true;
            }
          });
        } else {
          if (child?.geometry?.type !== 'Box') {
            child.visible = true;
          }
        }
      });

      targetRef.current.visible = targetVisible;
    }
  }, 1);

  return null;
}

export default AfterimageEffect;
