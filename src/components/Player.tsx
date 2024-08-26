import { useRef, useState, useContext, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useKeyboardControls, useHelper, Trail } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Speed } from '../helpers';
import { AppContext } from '../context/AppContext';

import * as THREE from 'three';

interface PlayerProps {
  startPosition: number[];
  planesTopRef: React.RefObject<HTMLSelectElement>;
  planesBottomRef: React.RefObject<HTMLSelectElement>;
}

function Player({ startPosition, planesTopRef, planesBottomRef }: PlayerProps) {
  const appContext = useContext(AppContext);
  const gameStart = appContext?.gameStart;
  const toggleGameStart = appContext?.toggleGameStart;

  const playerRef = useRef(null);
  const container = useRef();
  const cameraTarget = useRef();
  const cameraPosition = useRef();

  const gltf = useLoader(GLTFLoader, '/models/Spaceship.glb');

  // useHelper(playerRef, THREE.BoxHelper, 'red');

  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());

  const [acc, setAcc] = useState(0);
  const [playerFreeze, setPlayerFreeze] = useState(false);

  const forwardPressed = useKeyboardControls((state) => state['forward']);

  const glowShader = useMemo(
    () => ({
      vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 innerColor;
      uniform vec3 outerColor;
      uniform vec3 glowColor;
      uniform float glowIntensity;
      varying vec3 vNormal;
      
      void main() {
        // Calculate the distance from the center of the sphere (based on the normal)
        float gradient = (1.0 + vNormal.z) / 2.0;

        // Interpolate between the inner and outer colors based on the gradient
        vec3 color = mix(innerColor, outerColor, gradient);
        
        // Set the final color with the calculated opacity
        gl_FragColor = vec4(color, 1.);
      }
    `,
      uniforms: {
        innerColor: { value: new THREE.Color(0x0000ff) }, // Outer color (blue)
        outerColor: { value: new THREE.Color(0xffffff) }, // Inner color (white)
        glowIntensity: { value: 0.2 },
      },
      transparent: false,
      side: THREE.FrontSide, // You can also use BackSide for different effects
    }),
    []
  );

  // Player and camera rotation based on mouse pointer
  useFrame(({ pointer }) => {
    // Freeze player before restarting
    if (playerFreeze) return;

    // Set rotation of player to 0 when starting
    if (!gameStart && playerRef?.current) {
      // container.current.rotation.x = THREE.MathUtils.degToRad(0);
      playerRef.current.rotation.x = 0;
      return;
    }

    if (playerRef?.current) {
      playerRef.current.rotation.x = THREE.MathUtils.lerp(
        playerRef.current.rotation.x,
        -pointer.y * 1 - THREE.MathUtils.degToRad(180),
        0.1
      );

      playerRef.current.rotation.y = THREE.MathUtils.lerp(
        playerRef.current.rotation.y,
        pointer.x * 1 - THREE.MathUtils.degToRad(180),
        0.1
      );
    }

    if (cameraTarget?.current && cameraPosition?.current) {
      cameraTarget.current.position.y = pointer.y * 2;
      cameraPosition.current.position.y = -pointer.y * 2;
    }
  });

  // Player movement and collision detection
  useFrame(({ clock }) => {
    const { PlayerSpeed, Acceleration } = Speed;
    const forward = new THREE.Vector3();

    // Move player forward after freeze
    if (playerFreeze && container?.current && playerRef?.current) {
      const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
      playerRef.current.getWorldDirection(forward);
      playerRef.current.position.sub(forward.multiplyScalar(velocity.z));
      return;
    }

    // If game starting place container and player positions to start
    if (!gameStart && container?.current && playerRef?.current) {
      container.current.position.set(0, 0, 0);
      playerRef.current.position.set(0, 0, -6200);
      return;
    }

    // Player movement
    if (container?.current && playerRef?.current && forwardPressed) {
      if (acc < PlayerSpeed) {
        const velocity = new THREE.Vector3(0, 0, -acc);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));

        setAcc(acc + Acceleration);
      } else {
        const velocity = new THREE.Vector3(0, 0, -PlayerSpeed);
        playerRef.current.getWorldDirection(forward);
        container.current.position.sub(forward.multiplyScalar(velocity.z));
      }
    } else {
      setAcc(0);

      const elapsedTime = clock.getElapsedTime();
      playerRef.current.position.y = Math.sin(elapsedTime * 2) * 0.1;
      cameraTarget.current.position.y = Math.sin(elapsedTime * 2) * 0.1;
    }
  });

  // Position camera relative to player
  useFrame(({ camera }) => {
    // Freeze player before restarting
    // if (playerFreeze) return;

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.5);

    if (cameraTarget?.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.5);

      camera.lookAt(cameraLookAt.current);
    }
  });

  // Check if player intersects any of the collision boxes, and set game logic
  useFrame(() => {
    const combinedPlanes = [
      ...planesTopRef.current,
      ...planesBottomRef.current,
    ];
    combinedPlanes.forEach((plane: any) => {
      const box = new THREE.Box3().setFromObject(playerRef.current);
      const planeBox = new THREE.Box3().setFromObject(plane);
      if (box.intersectsBox(planeBox)) {
        setPlayerFreeze(true);

        setTimeout(() => {
          toggleGameStart(false);
        }, 350);
      }
    });
  });

  return (
    <group ref={container}>
      <group ref={cameraTarget} position-z={startPosition[2] + 1.5} />
      <group ref={cameraPosition} position-z={startPosition[2] - 4} />

      {/* Player group */}
      <group ref={playerRef} position={startPosition}>
        {/* Lights group */}
        {forwardPressed && (
          <group>
            <Trail
              width={2}
              length={1}
              color={'lightblue'}
              attenuation={(t) => t * t}
            >
              <mesh position={[0.31, -0.3, -0.45]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <shaderMaterial args={[glowShader]} />
              </mesh>
            </Trail>
            <Trail
              width={2}
              length={1}
              color={'lightblue'}
              attenuation={(t) => t * t}
            >
              <mesh position={[-0.31, -0.3, -0.45]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <shaderMaterial args={[glowShader]} />
              </mesh>
            </Trail>
            <Trail
              width={2}
              length={1}
              color={'lightblue'}
              attenuation={(t) => t * t}
            >
              <mesh position={[-0.27, 0.37, -0.49]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <shaderMaterial args={[glowShader]} />
              </mesh>
            </Trail>
            <Trail
              width={2}
              length={1}
              color={'lightblue'}
              attenuation={(t) => t * t}
            >
              <mesh position={[0.27, 0.37, -0.49]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <shaderMaterial args={[glowShader]} />
              </mesh>
            </Trail>
          </group>
        )}
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}

export default Player;
