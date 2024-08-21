import * as THREE from 'three';

interface DonutHexagonProps {
  radius: number;
  thickness: number;
  groupPosition: number;
}

const DonutHexagon = ({
  radius = 5,
  thickness = 1,
  groupPosition,
}: DonutHexagonProps) => {
  // Hexagon angle
  const angleStep = (Math.PI * 2) / 6;
  const sideLength = 2.5 * radius * Math.sin(Math.PI / 6); // Length of the side of the hexagon

  // Positions and rotations of the hexagon sides
  const planes = Array.from({ length: 6 }, (_, i) => {
    const angle = i * angleStep;
    return {
      position: [
        (radius + thickness / 2) * Math.cos(angle),
        (radius + thickness / 2) * Math.sin(angle),
        0,
      ],
      rotation: [0, 0, angle],
    };
  });

  return (
    <group position={groupPosition}>
      {planes.map(({ position, rotation }, index) => (
        <mesh key={index} position={position} rotation={rotation}>
          <planeGeometry args={[thickness, sideLength]} />
          <meshBasicMaterial
            color={`black`}
            wireframe
            // opacity={0}
            // transparent
          />
        </mesh>
      ))}
    </group>
  );
};

export default DonutHexagon;
