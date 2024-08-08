import { Text } from '@react-three/drei';

interface StartTextProps {
  timer: Number;
}

function StartText({ timer }: StartTextProps) {
  return (
    <Text
      scale={[-0.65, 0.65, 0.65]}
      position={[0, 0, -6201]}
      color='#010b19'
      anchorX='center'
      anchorY='middle'
    >
      {timer.toString()}
    </Text>
  );
}

export default StartText;
