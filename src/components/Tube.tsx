import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { GradientTexture } from '@react-three/drei';
import { useKeyboardControls } from '@react-three/drei';
import { Controls, Speed } from '../helpers';

interface TubeProps {
  rotation: Number;
  cameraPosition: Number;
  playerPosition: Number;
}

interface TunnelProps {
  curve: any;
  position: Number;
  rotation: Number;
  cameraPosition: Number;
  playerPosition: Number;
}

const Tunnel = ({
  curve,
  position,
  rotation,
  cameraPosition,
  playerPosition,
}: TunnelProps) => {
  const tubeRef = useRef();

  const [stops, setStops] = useState([0, 0.005, 0.015, 0.02, 0.025, 1]);

  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);

  // Create tube geometry and modify vertices
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(curve, 2500, 50, 32, false);

    return baseGeometry;
  }, [curve]);

  // Change UV direction of tube
  useEffect(() => {
    if (tubeRef.current) {
      const geometry = tubeRef.current.geometry;
      const uvs = geometry.attributes.uv.array;

      // Modify UVs to apply the gradient around the circumference
      for (let i = 0; i < uvs.length; i += 2) {
        const x = uvs[i];
        const y = uvs[i + 1];
        uvs[i] = y; // Swap x and y to rotate the texture
        uvs[i + 1] = x;
      }

      geometry.attributes.uv.needsUpdate = true;
    }
  }, []);

  // useFrame(() => {
  //   if (tubeRef?.current && forwardPressed) {
  //     setStops((prevStops) => {
  //       const newStops = prevStops.map((stop) =>
  //         stop < 1 ? stop + 0.0002 : 1
  //       );
  //       return newStops;
  //     });
  //   }
  // });

  // useEffect(() => {
  // const zMax = cameraPosition + 7383.5;
  // const stopConst = [0, 0.005, 0.015, 0.02, 0.025, 1];
  // if (zMax > 0 && zMax < 7383.5) {
  // console.log('cameraPosition', zMax);
  // console.log('stop', stops[2]);
  // const updatedStops = stopConst.map((el, index) => {
  // return zMax + el < 1 ? zMax + el : 1;
  // });
  // console.log('updatedStops', updatedStops[1]);
  // setStops((prevStops) => {
  //   const newStops = prevStops.map((stop, index) =>
  //     index < prevStops.length - 1 ? (zMax + stop) % 1 : 1
  //   );
  //   console.log('newStops', newStops);
  //   return newStops;
  // });
  // setStops(updatedStops);
  // }
  // }, [cameraPosition]);

  useEffect(() => {
    console.log('playerPosition', playerPosition);
    // console.log('playerPosition modulo', playerPosition / 10);
    const updatedStops = [0, 0.005, 0.015, 0.02, 0.025, 1].map((el) => {
      return el + playerPosition / 14900 < 1 ? el + playerPosition / 14900 : 1;
    });
    console.log('updatedStops', updatedStops);
    setStops(updatedStops);
  }, [playerPosition]);

  // useFrame(() => {
  //   setStops((prevStops) => {
  //     const newStops = prevStops.map((stop, index) =>
  //       index < prevStops.length - 1 ? (stop + 0.001) % 1 : 1
  //     );
  //     return newStops;
  //   });
  // });

  return (
    <group>
      <mesh
        ref={tubeRef}
        geometry={geometry}
        rotation-y={rotation}
        position-z={position}
      >
        <bufferGeometry attach='geometry' {...geometry} />
        <meshStandardMaterial
          color='transparent'
          side={THREE.BackSide}
          transparent
          opacity={1}
        >
          <GradientTexture
            stops={stops}
            colors={[
              'black',
              'blue',
              'red',
              'yellow',
              'lightgrey',
              'lightgrey',
            ]}
            // size={1024}
          />
        </meshStandardMaterial>
        <lineSegments geometry={geometry}>
          <lineBasicMaterial color='white' linewidth={5} />
        </lineSegments>
      </mesh>
    </group>
  );
};

function Tube({ rotation, cameraPosition, playerPosition }: TubeProps) {
  // Create a curve based on the points
  const curve = useMemo(() => {
    // Create an empty array to stores the points
    let points = [];
    // Define points along Z axis
    for (let i = 0; i < 50; i += 1) {
      const yPoint = i > 2 && i < 48 ? Math.random() * 500 : 0;
      // const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(0, yPoint, -300 * i));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const position = -10;

  return (
    <Tunnel
      curve={curve}
      rotation={rotation}
      position={position}
      cameraPosition={cameraPosition}
      playerPosition={playerPosition}
    />
  );
}

export default Tube;
