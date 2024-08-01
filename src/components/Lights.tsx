function Lights() {
  return (
    <group>
      <directionalLight position={[-10, 10, 5]} intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

export default Lights;
