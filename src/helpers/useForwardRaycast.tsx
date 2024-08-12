import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Object3D, Raycaster, Vector3 } from 'three';
import * as THREE from 'three';

export const useForwardRaycast = (obj: { current: Object3D | null }) => {
  const raycaster = useMemo(
    () => new Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 0.1),
    []
  );
  const pos = useMemo(() => new Vector3(), []);
  const dir = useMemo(() => new Vector3(), []);
  const scene = useThree((state) => state.scene);

  return () => {
    if (!obj.current) return [];
    raycaster.set(
      obj.current.getWorldPosition(pos),
      obj.current.getWorldDirection(dir)
    );
    return raycaster.intersectObjects(scene.children);
  };
};
