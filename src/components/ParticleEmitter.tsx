import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

function ParticleEmitter({ sphereRadius }: { sphereRadius: number }) {
  const particlesRef = useRef();
  const numParticles = 1000; // Number of particles

  // Create particle positions
  const particlesData = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * sphereRadius * 2; // Width equals sphere radius
      const y = (Math.random() - 0.5) * sphereRadius * 2; // Height equals sphere radius
      const z = -Math.random() * sphereRadius * 20; // Length is double the sphere radius
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [sphereRadius]);

  // Animate particles along the z-axis
  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < numParticles; i++) {
      positions[i * 3 + 2] -= 0.1; // Move along the negative z-axis
      // Reset particle if it goes beyond a certain range
      if (positions[i * 3 + 2] < -sphereRadius * 2) {
        positions[i * 3 + 2] = 0;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={particlesData}
          count={numParticles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color='#ffffff' />
    </points>
  );
}

export default ParticleEmitter;
