import * as THREE from 'three';
import * as React from 'react';
import CSM from 'three-custom-shader-material';
import { patchShaders } from 'gl-noise';
import { useFrame } from '@react-three/fiber';
// import { easing } from 'maath';

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
  }`;

const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 vUv;
  uniform float uThickness;
  uniform vec3 uColor;
  uniform float uProgress;

  void main() {
    gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
    float noise = gln_sfbm(vUv, opts);
    noise = gln_normalize(noise);

    float progress = uProgress;

    float alpha = step(1.0 - progress, noise);
    float border = step((1.0 - progress) - uThickness, noise) - alpha;

    csm_DiffuseColor.a = alpha + border;
    csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
  }`);

const uniforms = {
  uThickness: { value: 0.1 },
  uColor: { value: new THREE.Color('#107ad2').multiplyScalar(20) },
  uProgress: { value: 0 },
};

function DissolveMaterial({
  baseMaterial,
  thickness = 0.1,
  color = '#107ad2',
  intensity = 50,
  duration = 1,
  visible = true,
}) {
  React.useLayoutEffect(() => {
    uniforms.uThickness.value = thickness;
    uniforms.uColor.value.set(color).multiplyScalar(intensity);
  }, [thickness, color, intensity]);

  useFrame((_state, delta) => {
    // easing.damp(uniforms.uProgress, 'value', visible ? 1 : 0, duration, delta);
    // Calculate the target value based on visibility
    const targetValue = visible ? 1 : 0;

    // Calculate the amount of change per frame
    const progressStep = delta / duration;

    // Interpolate uProgress value
    if (targetValue > uniforms.uProgress.value) {
      uniforms.uProgress.value = Math.min(
        uniforms.uProgress.value + progressStep,
        targetValue
      );
    } else if (targetValue < uniforms.uProgress.value) {
      uniforms.uProgress.value = Math.max(
        uniforms.uProgress.value - progressStep,
        targetValue
      );
    }
  });

  return (
    <>
      <CSM
        baseMaterial={baseMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        toneMapped={false}
        transparent
      />
    </>
  );
}

export default DissolveMaterial;
