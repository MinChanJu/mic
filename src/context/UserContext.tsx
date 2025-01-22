import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getAllSolvesByUserId } from '../api/solve';
import { User, InitUser } from '../types/entity/User';
import { Solve } from '../types/entity/Solve';

interface UserContextProps {
  user: User;
  solves: Solve[]
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setSolves: React.Dispatch<React.SetStateAction<Solve[]>>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : InitUser;
  });

  const [solves, setSolves] = useState<Solve[]>([]);

  useEffect(() => {
    async function loadSolves() {
      if (user.name !== "") {
        try {
          const response = await getAllSolvesByUserId(user.userId);
          setSolves(response.data);
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response) console.error(error.response.data.message);
            else console.error("서버 에러: ", error)
          } else {
            console.error("알 수 없는 에러:", error);
          }
        }
      }
    }
    loadSolves();
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(InitUser);
    setSolves([])
    window.location.reload();
  };

  return (
    <UserContext.Provider value={{ user, solves, setUser, setSolves, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 UserProvider 내에서만 사용할 수 있습니다.');
  }
  return context;
};