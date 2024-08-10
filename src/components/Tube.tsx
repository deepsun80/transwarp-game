import { useMemo, useRef, useState, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { GradientTexture } from '@react-three/drei';
import { AppContext } from '../context/AppContext';

interface TubeProps {
  rotation: Number;
  playerPositionZ: Number;
  playerPositionY: Number;
}

interface TunnelProps {
  curve: any;
  position: Number;
  rotation: Number;
  playerPositionZ: Number;
}

const Tunnel = ({
  curve,
  position,
  rotation,
  playerPositionZ,
}: TunnelProps) => {
  const tubeRef = useRef();

  const [stops, setStops] = useState([0, 0.005, 0.015, 0.02, 0.025, 1]);

  // Create tube geometry and modify vertices
  const geometry = useMemo(() => {
    const baseGeometry = new THREE.TubeGeometry(curve, 2500, 55, 32, false);

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

  // Make colors follow player position
  useEffect(() => {
    const updatedStops = [0, 0.005, 0.015, 0.02, 0.025, 1].map((el) => {
      return el + playerPositionZ / 6050 >= 1
        ? 1
        : el + playerPositionZ / 6050 <= 0
        ? 0
        : el + playerPositionZ / 6050;
    });
    setStops(updatedStops);
  }, [playerPositionZ]);

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
              '#010b19',
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

function Tube({ rotation, playerPositionZ, playerPositionY }: TubeProps) {
  const appContext = useContext(AppContext);

  const toggleGameStart = appContext?.toggleGameStart;

  // Create curve points
  const points = useMemo(() => {
    let points = [];

    // Define points along Z axis
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
    return points;
  }, []);

  // Create curve from points
  const curve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    return curve;
  }, []);

  // Get y-coordinate of curve from z-axis of player
  useEffect(() => {
    // Function to get difference between numbers
    function diff(num1: number, num2: number) {
      if (num1 > num2) {
        return num1 - num2;
      } else {
        return num2 - num1;
      }
    }

    // Function to get y-coordinate at a specific z-coordinate
    const getYAtZ = (z: number) => {
      // Normalize z to a value between 0 and 1
      const t = Math.abs(z / points[points.length - 1].z);

      // Get the point on the curve at normalized t
      const point = curve.getPoint(t);
      return point.y;
    };
    // Get y-coordinate of curve at z-coordinate of player
    const curveYCoord = getYAtZ(6200 - playerPositionZ);
    // console.log('curveYCoord', curveYCoord, playerPositionY);
    const test = diff(Math.abs(curveYCoord), Math.abs(playerPositionY));
    // console.log('test', test);
    if (test > 102) {
      toggleGameStart(false);
    }

    // console.log('curveYCoord', curveYCoord);
    // console.log('playerPositionY', playerPositionY);
    // if (curveYCoord - 90 > playerPositionY) {
    //   console.log('game restart');
    // }
    // if (curveYCoord + 102 < playerPositionY) {
    //   console.log('curveYCoord', curveYCoord);
    //   console.log('playerPositionY', playerPositionY);
    //   console.log('game restart');
    // }
  }, [playerPositionZ]);

  const position = -10;

  return (
    <Tunnel
      curve={curve}
      rotation={rotation}
      position={position}
      playerPositionZ={playerPositionZ}
      playerPositionY={playerPositionY}
    />
  );
}

export default Tube;
