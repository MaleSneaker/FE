import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../types/user";

type IAuthContext = {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  user: null | IUser;
  setUser: (value: IUser | null) => void;
  updateUser: (userData: IUser) => void;
};
const AuthContext = createContext<IAuthContext>({
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  
  const updateUser = (userData: IUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    setUser(userData);
    setIsLogged(!!user);
  }, []);
  
  console.log(user);
  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
