import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext({
  access: '',
  refresh: '',
  isAuthenticated: false,
  authenticate: (access,refresh) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authAccess, setAuthAccess] = useState();
  const [authRefresh, setAuthRefresh] = useState();

  function authenticate(access,refresh) {
    setAuthAccess(access);
    setAuthRefresh(refresh)
    AsyncStorage.setItem('access', access);
    AsyncStorage.setItem('refresh', refresh);

  }


  function logout() {
    console.log("logiut")
    setAuthAccess(null);
    setAuthRefresh(null)
    AsyncStorage.removeItem('access');
    AsyncStorage.removeItem('refresh');
    
  }

  const value = {
    access: authAccess,
    setAuthAccess: setAuthAccess,
    refresh: authRefresh,
    isAuthenticated: !!authAccess && !!authRefresh,
    authenticate: authenticate,
    logout: logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};