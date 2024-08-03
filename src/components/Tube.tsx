import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import patternOne from '../assets/pattern1.png';

interface TubeProps {
  rotation: Number;
}

function Tube({ rotation }: TubeProps) {
  const pointImg = useLoader(THREE.TextureLoader, patternOne);

  // Create a curve based on the points
  // const [curve] = useState(() => {
  //   // Create an empty array to stores the points
  //   let points = [];
  //   // Define points along Z axis
  //   for (let i = 0; i < 50; i += 1) {
  //     const yPoint = i > 2 && i < 48 ? Math.random() * 300 : 0;
  //     points.push(new THREE.Vector3(0, yPoint, -150 * i));
  //   }
  //   return new THREE.CatmullRomCurve3(points);
  // });
  // Create the tube path
  const path = useMemo(() => {
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 300 : 0;
      points.push(new THREE.Vector3(0, yPoint, -150 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Create the tube geometry
  // const tubeGeometry = useMemo(
  //   () => new THREE.TubeGeometry(path, 1000, 50, 50, false),
  //   [path]
  // );

  // Create the ripple effect shader material
  // const material = useMemo(() => {
  //   return new THREE.ShaderMaterial({
  //     uniforms: {
  //       time: { value: 0 },
  //     },
  //     vertexShader: `
  //       varying vec2 vUv;
  //       varying vec3 vPosition;
  //       void main() {
  //         vUv = uv;
  //         vPosition = position;
  //         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //       }
  //     `,
  //     fragmentShader: `
  //       uniform float time;
  //       varying vec2 vUv;
  //       varying vec3 vPosition;
  //       void main() {
  //         float frequency = 1000.0;
  //         float amplitude = 0.5;
  //         float ripple = sin(frequency * vUv.x + time) * amplitude;
  //         vec3 color = vec3(
  //           0.5 + 0.5 * cos(3.141592653589793 * vUv.x + ripple + 0.0),
  //           0.5 + 0.5 * cos(3.141592653589793 * vUv.x + ripple + 2.0),
  //           0.5 + 0.5 * cos(3.141592653589793 * vUv.x + ripple + 4.0)
  //         );
  //         gl_FragColor = vec4(color, 1.0);
  //       }
  //     `,
  //     side: THREE.DoubleSide,
  //   });
  // }, []);

  // // Update the time uniform in the shader material
  // useFrame((state) => {
  //   material.uniforms.time.value = state.clock.getElapsedTime() * 10;
  // });

  return (
    <group>
      <mesh
        // geometry={tubeGeometry}
        // material={material}
        rotation-y={rotation}
        position-z={-30}
      >
        <tubeGeometry args={[path, 1000, 55, 50, false]} />
        <meshStandardMaterial
          color={'black'}
          side={2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <points rotation-y={rotation} position-z={-30}>
        <tubeGeometry args={[path, 1000, 50, 50, false]} />
        <pointsMaterial
          size={3}
          sizeAttenuation
          color={'white'}
          // attach='material'
          // map={pointImg}
          // transparent={false}
          // alphaTest={0.5}
          // opacity={1}
        />
      </points>
    </group>
  );
}

export default Tube;
