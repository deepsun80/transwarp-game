import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeProps {
  rotation: Number;
}

// Twist function from the article
// const applyTwist = (geometry, angle) => {
//   const quaternion = new THREE.Quaternion();
//   const positionAttribute = geometry.attributes.position;

//   const vector = new THREE.Vector3();
//   for (let i = 0; i < positionAttribute.count; i++) {
//     vector.fromBufferAttribute(positionAttribute, i);

//     const yPos = vector.z;
//     const twistAngle = angle * yPos;

//     quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), twistAngle);
//     vector.applyQuaternion(quaternion);

//     positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
//   }

//   geometry.attributes.position.needsUpdate = true;
// };

function Tube({ rotation }: TubeProps) {
  const [particleSize, setParticleSize] = useState(7);

  // Particle texture
  const circle = new THREE.TextureLoader().load('/circle.png');

  // Create the tube path -- useMemo?
  const path = useMemo(() => {
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 300 : 0;
      points.push(new THREE.Vector3(0, yPoint, -150 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Create tube geometry
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(path, 2000, 35, 64, false);
  }, [path]);

  // const twistAngle = Math.PI / 100; // Twist angle
  // applyTwist(tubeGeometry, twistAngle);

  // create buffer geometry for tube points
  const tubeBuffer = useMemo(() => {
    const tubeBufferGeom = new THREE.BufferGeometry();
    // Add tube geometry points to tube buffer
    tubeBufferGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        tubeGeometry.attributes.position.array,
        3
      )
    );
    return tubeBufferGeom;
  }, [tubeGeometry]);

  // Step 3: Generate random points on the surface of the tube
  // const randomPoints = useMemo(() => {
  //   const points = [];
  //   const radius = tubeGeometry.parameters.radius;
  //   const path = tubeGeometry.parameters.path;

  //   for (let i = 0; i < 100; i++) {
  //     const u = Math.random();
  //     const v = Math.random();

  //     // Calculate a point along the curve
  //     const pointOnCurve = path.getPointAt(u);
  //     const tangent = path.getTangentAt(u);
  //     const normal = new THREE.Vector3();
  //     const binormal = new THREE.Vector3();

  //     // Create the normal and binormal vectors
  //     path.computeFrenetFrames(1, true);
  //     normal.crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
  //     binormal.crossVectors(tangent, normal).normalize();

  //     const angle = v * Math.PI * 2;
  //     const direction = normal
  //       .clone()
  //       .multiplyScalar(Math.cos(angle))
  //       .add(binormal.clone().multiplyScalar(Math.sin(angle)));
  //     direction.multiplyScalar(radius);

  //     // Final random point on the tube's surface
  //     const randomPoint = pointOnCurve.clone().add(direction);
  //     points.push(randomPoint);
  //   }

  //   return points;
  // }, [tubeGeometry]);

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
      {/* <mesh
        geometry={tubeGeometry}
        // material={material}
        // rotation-y={rotation}
        // position-z={-30}
      >
        <tubeGeometry args={[path, 1000, 55, 50, false]} />
        <meshStandardMaterial
          color={'lightgrey'}
          side={2}
          // transparent
          // opacity={0.3}
        />
      </mesh> */}

      <points args={[tubeBuffer]}>
        <pointsMaterial
          size={particleSize}
          sizeAttenuation={true}
          map={circle}
          alphaTest={0.5}
          transparent={true}
        />
      </points>
    </group>
  );
}

export default Tube;
