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
  const pointsTwo = useMemo(() => curve.getPoints(count / 2), [curve, count]);

  return (
    <group position-z={position}>
      {/* Tunnel with shader */}
      {points.map((point: any, index: number) => (
        <mesh key={index} position={point.toArray()} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[650, 650]} />
          <tunnelShader uLevel={index / 120} />
          {/* <meshBasicMaterial color='hotpink' side={THREE.FrontSide} /> */}
        </mesh>
      ))}

      {/* Collision detection boxes on top and bottom of tube */}
      {pointsTwo.map((point: any, index: number) => (
        <group key={index}>
          <mesh
            ref={(el) => (planesTopRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] + 90,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <boxGeometry args={[165, 35, 10]} />
            <meshBasicMaterial
              color='white'
              wireframe
              opacity={0}
              transparent
            />
          </mesh>
          <mesh
            ref={(el) => (planesBottomRef.current[index] = el)}
            position={[
              point.toArray()[0],
              point.toArray()[1] - 90,
              point.toArray()[2],
            ]}
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            <boxGeometry args={[165, 35, 10]} />
            <meshBasicMaterial
              color='white'
              wireframe
              opacity={0}
              transparent
            />
          </mesh>
        </group>
      ))}

      {/* Collision detection boxes on left and right of tube */}
      {pointsTwo.map((point: any, index: number) => (
        <group key={index}>
          <mesh
            // ref={(el) => (planesTopRef.current[index] = el)}
            position={[
              point.toArray()[0] + 80,
              point.toArray()[1],
              point.toArray()[2],
            ]}
            rotation={[0, Math.PI, Math.PI / 2]}
          >
            <boxGeometry args={[145, 10, 35]} />
            <meshBasicMaterial
              color='white'
              wireframe
              opacity={0}
              transparent
            />
          </mesh>
          <mesh
            // ref={(el) => (planesBottomRef.current[index] = el)}
            position={[
              point.toArray()[0] - 80,
              point.toArray()[1],
              point.toArray()[2],
            ]}
            rotation={[0, Math.PI, Math.PI / 2]}
          >
            <boxGeometry args={[145, 10, 35]} />
            <meshBasicMaterial
              color='white'
              wireframe
              opacity={0}
              transparent
            />
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
      let xPoint = 0;
      if (i > 1 && i < 18 && i % 2 !== 0) {
        yPoint = Math.random() * -200;
        xPoint = Math.random() * -200;
      } else if (i > 1 && i < 18 && i % 2 === 0) {
        yPoint = Math.random() * 200;
        xPoint = Math.random() * 200;
      }
      // const yPoint = i > 1 && i < 18 ? Math.random() * 400 : 0;
      // const xPoint = i > 2 && i < 48 ? Math.random() * 200 : 0;
      points.push(new THREE.Vector3(xPoint, yPoint, -325 * i));
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
