import { useMemo } from 'react';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

import { TunnelShader } from './TunnelShader';

extend({
  TunnelShader,
});

interface TubeProps {
  rotation: Number;
  planesTopRef: React.RefObject<HTMLSelectElement>;
  planesBottomRef: React.RefObject<HTMLSelectElement>;
}

interface TunnelProps {
  curve: any;
  count: number;
  position: Number;
  rotation: Number;
  planesTopRef: React.RefObject<HTMLSelectElement>;
  planesBottomRef: React.RefObject<HTMLSelectElement>;
}

const Tunnel = ({
  curve,
  count,
  position,
  rotation, // Use this to rotate each tube modules
  planesTopRef,
  planesBottomRef,
}: TunnelProps) => {
  // Sample points on the curve
  const points = useMemo(() => curve.getPoints(count), [curve, count]);

  return (
    <group position-z={position}>
      {/* Tunnel with shader */}
      {points.map((point: any, index: number) => (
        <mesh key={index} position={point.toArray()} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[350, 350]} />
          <tunnelShader uLevel={index / 120} />
          {/* <meshBasicMaterial color='hotpink' side={THREE.FrontSide} /> */}
        </mesh>
      ))}
      {/* Collision detection boxes on top and bottom of tube */}
      {points.map((point: any, index: number) => (
        <group key={index}>
          <mesh
            ref={(el) => (planesTopRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] + 100,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <boxGeometry args={[50, 25, 10]} />
            <meshBasicMaterial color='white' />
          </mesh>
          <mesh
            ref={(el) => (planesBottomRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] - 100,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <boxGeometry args={[50, 25, 10]} />
            <meshBasicMaterial color='white' />
          </mesh>
        </group>
      ))}
    </group>
  );
};

function Tube({ rotation, planesTopRef, planesBottomRef }: TubeProps) {
  // Create curve points
  const points = useMemo(() => {
    let points = [];

    // Define points along Z axis
    for (let i = 0; i < 20; i += 1) {
      let yPoint = 0;
      if (i > 1 && i < 18 && i % 2 !== 0) {
        yPoint = -200;
      } else if (i > 1 && i < 18 && i % 2 === 0) {
        yPoint = 200;
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

  const position = -10; // Move tube slightly from center sphere

  return (
    <Tunnel
      curve={curve}
      count={1000}
      rotation={rotation}
      position={position}
      planesTopRef={planesTopRef}
      planesBottomRef={planesBottomRef}
    />
  );
}

export default Tube;
