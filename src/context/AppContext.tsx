import { createContext, useState } from 'react';

interface AppContextProps {
  gameStart: boolean;
  toggleGameStart: (toggle: boolean) => void;
}

export const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameStart, setGameStart] = useState<boolean>(false);

  const toggleGameStart = (toggle: boolean) => {
    setGameStart(toggle);
  };

  return (
    <AppContext.Provider
      value={{
        gameStart,
        toggleGameStart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
