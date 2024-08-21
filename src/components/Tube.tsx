import { useMemo } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

import { TunnelShader } from './TunnelShader';
// import { AppContext } from '../context/AppContext';

extend({
  TunnelShader,
});

interface TubeProps {
  rotation: Number;
}

interface TunnelProps {
  curve: any;
  count: number;
  position: Number;
  rotation: Number;
}

const Tunnel = ({ curve, count, position, rotation }: TunnelProps) => {
  // Sample points on the curve
  const points = useMemo(() => curve.getPoints(count), [curve, count]);
  const pointsDiv = useMemo(() => curve.getPoints(count / 10), [curve, count]);

  console.log('pointsDiv', pointsDiv[0].toArray());

  return (
    <group position-z={position}>
      {points.map((point: any, index: number) => (
        <mesh key={index} position={point.toArray()} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[200, 200]} />
          <tunnelShader uLevel={index / 120} />
          {/* <meshBasicMaterial color='hotpink' side={THREE.FrontSide} /> */}
        </mesh>
      ))}
      {points.map((point: any, index: number) => (
        <group key={index}>
          <mesh
            // ref={(el) => (planesRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] + 40,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <planeGeometry args={[50, 5]} />
            <meshBasicMaterial color='white' wireframe />
          </mesh>
          <mesh
            // ref={(el) => (planesRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] - 40,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <planeGeometry args={[50, 5]} />
            <meshBasicMaterial color='white' wireframe />
          </mesh>
        </group>
      ))}
    </group>
  );
};

function Tube({ rotation }: TubeProps) {
  // const appContext = useContext(AppContext);
  // const toggleGameStart = appContext?.toggleGameStart;

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

  const position = -10;

  return (
    <Tunnel
      curve={curve}
      count={1000}
      rotation={rotation}
      position={position}
    />
  );
}

export default Tube;
