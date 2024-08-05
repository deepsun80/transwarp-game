import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  TubeGeometry,
  Vector3,
  CatmullRomCurve3,
  DoubleSide,
  Color,
} from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial, OrbitControls } from '@react-three/drei';

// Define the curve path
const curve = new CatmullRomCurve3([
  new Vector3(0, 0, 0),
  new Vector3(0, 1, 2),
  new Vector3(0, 1.5, 4),
  new Vector3(0, 2, 6),
  new Vector3(0, 2.5, 8),
  new Vector3(0, 3, 10),
]);

// Define tube geometry
const tubeGeometry = new TubeGeometry(curve, 20, 0.1, 8, false);

// Custom shader material
const CustomShaderMaterial = shaderMaterial(
  {
    color1: new Color(0xffff00), // Yellow
    color2: new Color(0xff0000), // Red
    color3: new Color(0x0000ff), // Blue
    color4: new Color(0x00ff00), // Green
  },
  `
    varying float vProgress;

    void main() {
      // Normalize the progress along the segment from 0 to 1
      vProgress = mod(position.z, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 color4;
    varying float vProgress;

    void main() {
      vec3 color;
      if (vProgress < 0.33) {
        color = mix(color1, color2, vProgress / 0.33);
      } else if (vProgress < 0.66) {
        color = mix(color2, color3, (vProgress - 0.33) / 0.33);
      } else {
        color = mix(color3, color4, (vProgress - 0.66) / 0.34);
      }
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ CustomShaderMaterial });

const Tube = () => {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} geometry={tubeGeometry}>
      <customShaderMaterial attach='material' side={DoubleSide} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas>
      <OrbitControls />
      <Tube />
    </Canvas>
  );
}
