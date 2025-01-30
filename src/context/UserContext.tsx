import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, InitUser } from '../types/entity/User';

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : InitUser;
  });

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(InitUser);
    if (window.location.pathname === "/setting") {
      window.location.href = "/"; // 홈으로 이동
    } else {
      window.location.reload();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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