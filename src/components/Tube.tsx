import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeProps {
  rotation: Number;
}

// Twist function from the article
const applyTwist = (geometry, angle) => {
  const quaternion = new THREE.Quaternion();
  const positionAttribute = geometry.attributes.position;

  const vector = new THREE.Vector3();
  for (let i = 0; i < positionAttribute.count; i++) {
    vector.fromBufferAttribute(positionAttribute, i);

    const yPos = vector.z;
    const twistAngle = angle * yPos;

    quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), twistAngle);
    vector.applyQuaternion(quaternion);

    positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
  }

  geometry.attributes.position.needsUpdate = true;
};

function Tube({ rotation }: TubeProps) {
  const [particleSize, setParticleSize] = useState(3);
  const [color, setColor] = useState(new THREE.Color('white'));
  // const [particleSizeOne, setParticleSizeTwo] = useState(12);

  const direction = useRef(1); // 1 for growing, -1 for shrinking
  const progress = useRef(0); // Track the progress of the animation between 0 and 1
  const speed = 0.007; // Speed of the progress change

  // Particle texture
  const circle = new THREE.TextureLoader().load('/circle2sm.png');

  // Create the tube path -- useMemo?
  const path = useMemo(() => {
    let points = [];

    for (let i = 0; i < 20; i += 1) {
      // let yPoint = 0;
      // if (i > 1 && i < 18 && i % 2 !== 0) {
      //   yPoint = Math.random() * -200;
      // } else if (i > 1 && i < 18 && i % 2 === 0) {
      //   yPoint = Math.random() * 200;
      // }
      const yPoint = i > 1 && i < 18 ? Math.random() * 500 : 0;
      // const xPoint = i > 1 && i < 18 ? Math.random() * 400 : 0;
      points.push(new THREE.Vector3(0, yPoint, -325 * i));
    }

    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Create tube geometry
  const tubeGeometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(path, 1000, 35, 64, false);
    const twistAngle = Math.PI / 500; // Twist angle

    // applyTwist(baseGeometry, twistAngle);

    return baseGeometry;
  }, [path]);

  // const tubeGeometryTwo = useMemo(() => {
  //   return new THREE.TubeGeometry(path, 2000, 55, 64, false);
  // }, [path]);

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

  // const tubeBufferTwo = useMemo(() => {
  //   const tubeBufferGeom = new THREE.BufferGeometry();
  //   // Add tube geometry points to tube buffer
  //   tubeBufferGeom.setAttribute(
  //     'position',
  //     new THREE.Float32BufferAttribute(
  //       tubeGeometryTwo.attributes.position.array,
  //       3
  //     )
  //   );
  //   return tubeBufferGeom;
  // }, [tubeGeometryTwo]);

  useFrame(() => {
    // Increment or decrement progress based on direction
    progress.current += speed * direction.current;

    // Use sine wave on both sides to ensure ease-in and ease-out at both ends
    const easedProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress.current);
    const newRadius = THREE.MathUtils.lerp(3, 12, easedProgress);
    // const newRadiusTwo = THREE.MathUtils.lerp(12, 8, easedProgress);

    setParticleSize(newRadius);
    // setParticleSizeTwo(newRadiusTwo);

    // Animate the color based on the size
    const colorProgress = (newRadius - 3) / 9; // Progress from 0 to 1
    const color1 = new THREE.Color('lightblue');
    const color2 = new THREE.Color('orange');
    const color3 = new THREE.Color('yellow');
    const color4 = new THREE.Color('white');

    // Determine color based on the size progress
    let interpolatedColor;
    if (colorProgress <= 0.25) {
      interpolatedColor = color1.lerp(color2, colorProgress * 4); // White to Yellow
    } else if (colorProgress <= 0.5) {
      interpolatedColor = color2.lerp(color3, (colorProgress - 0.25) * 4); // Yellow to Red
    } else if (colorProgress <= 0.75) {
      interpolatedColor = color3.lerp(color4, (colorProgress - 0.5) * 4); // Red to Blue
    }

    setColor(interpolatedColor);

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
          color={color}
        />
      </points>

      {/* <points args={[tubeBufferTwo]} position-z={-5}>
        <pointsMaterial
          size={10}
          sizeAttenuation={true}
          map={circle}
          alphaTest={0.5}
          transparent={true}
        />
      </points> */}
    </group>
  );
}

export default Tube;
