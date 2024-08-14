import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeProps {
  rotation: Number;
}

function Tube({ rotation }: TubeProps) {
  const [particleSize, setParticleSize] = useState(3);
  // const [particleSizeOne, setParticleSizeTwo] = useState(12);

  const direction = useRef(1); // 1 for growing, -1 for shrinking
  const progress = useRef(0); // Track the progress of the animation between 0 and 1
  const speed = 0.007; // Speed of the progress change

  // Particle texture
  const circle = new THREE.TextureLoader().load('/circle2.png');

  // Create the tube path -- useMemo?
  const path = useMemo(() => {
    let points = [];

    for (let i = 0; i < 20; i += 1) {
      let yPoint = 0;
      if (i > 1 && i < 18 && i % 2 !== 0) {
        yPoint = Math.random() * -200;
      } else if (i > 1 && i < 18 && i % 2 === 0) {
        yPoint = Math.random() * 200;
      }
      // const yPoint = i > 1 && i < 18 ? Math.random() * 400 : 0;
      // const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(0, yPoint, -325 * i));
    }

    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Create tube geometry
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(path, 2000, 47, 64, false);
  }, [path]);

  const tubeGeometryTwo = useMemo(() => {
    return new THREE.TubeGeometry(path, 2000, 50, 64, false);
  }, [path]);

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

  const tubeBufferTwo = useMemo(() => {
    const tubeBufferGeom = new THREE.BufferGeometry();
    // Add tube geometry points to tube buffer
    tubeBufferGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        tubeGeometryTwo.attributes.position.array,
        3
      )
    );
    return tubeBufferGeom;
  }, [tubeGeometryTwo]);

  useFrame(() => {
    // Increment or decrement progress based on direction
    progress.current += speed * direction.current;

    // Use sine wave on both sides to ensure ease-in and ease-out at both ends
    const easedProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress.current);
    const newRadius = THREE.MathUtils.lerp(3, 12, easedProgress);
    // const newRadiusTwo = THREE.MathUtils.lerp(12, 8, easedProgress);

    setParticleSize(newRadius);
    // setParticleSizeTwo(newRadiusTwo);

    // Reverse direction when the animation completes a cycle
    if (progress.current >= 1 || progress.current <= 0) {
      direction.current *= -1;
      progress.current = THREE.MathUtils.clamp(progress.current, 0, 1); // Ensure progress stays within bounds
    }
  });

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

      <points args={[tubeBufferTwo]} position-z={-5}>
        <pointsMaterial
          size={13}
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
