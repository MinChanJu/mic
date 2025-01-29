import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getAllSolvesByUserId } from '../api/solve';
import { User, InitUser } from '../types/entity/User';
import { Solve } from '../types/entity/Solve';
import { resultInterval } from '../utils/resultInterval';

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
        let requestId = ''
        try {
          const response = await getAllSolvesByUserId(user.userId);
          requestId = response.data;
        } catch (error) {
          console.error("에러: ", error);
        }
        resultInterval("solves", requestId, 500, undefined, undefined, setSolves);
      }
    }
    loadSolves();
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(InitUser);
    setSolves([])
    if (window.location.pathname === "/setting") {
      window.location.href = "/"; // 홈으로 이동
    }
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