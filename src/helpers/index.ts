export const Controls = {
  forward: 'forward',
  back: 'back',
};

export const Speed = {
  PlayerSpeed: 4,
  Acceleration: 0.05,
  // RotationSpeed: 0.5,
};

// export function useKeyboard() {
//   const keyboard = useMemo(() => ({}), []); // Create a memoized object to store keyboard state

//   // Event handler for keydown event
//   const keydown = (e: { key: any }) => (keyboard[e.key] = true); // Set the corresponding key in the keyboard object to true when pressed

//   // Event handler for keyup event
//   const keyup = (e: { key: any }) => (keyboard[e.key] = false); // Set the corresponding key in the keyboard object to false when released

//   useEffect(() => {
//     // Add event listeners for keydown and keyup events
//     document.addEventListener('keydown', keydown);
//     document.addEventListener('keyup', keyup);

//     // Clean up the event listeners when the component unmounts
//     return () => {
//       document.removeEventListener('keydown', keydown);
//       document.removeEventListener('keyup', keyup);
//     };
//   });

//   return keyboard; // Return the keyboard object with the current keyboard state
// }

// Function to get player input from keyboard and mouse
// export function getInput(keyboard: any) {
//   let [x, y, z] = [0, 0, 0];
//   // Checking keyboard inputs to determine movement direction
//   if (keyboard['s']) z += 1.0; // Move backward
//   if (keyboard['w']) z -= 1.0; // Move forward

//   console.log([x, y, z]);

//   // Returning an object with the movement and look direction
//   return {
//     move: [x, y, z],
//     // running: keyboard["Shift"], // Boolean to determine if the player is running (Shift key pressed)
//   };
// }

// easing.dampE(
//   playerRef.current.rotation,
//   [-Math.PI * pointer.y, 0, 0],
//   0.1,
//   delta
// );
