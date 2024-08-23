function Lights() {
  return (
    <group>
      {/* <ambientLight intensity={0.5} /> */}
      <hemisphereLight
        skyColor={'red'} // Sky color
        groundColor={'blue'} // Ground color
        intensity={1} // Intensity of the light
        position={[10, 10, 0]} // Position of the light
      />
    </group>
  );
}

export default Lights;
