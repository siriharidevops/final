import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext} from 'react';
import axios from 'axios';
import {AuthContext, AuthContextProvider, useAuthContext} from './AuthContext'
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { AUTH_URL, ROOT_URL } from '../constants/constants';

const AxiosContext = createContext();
const {Provider} = AxiosContext;

const AxiosProvider = ({children}) => {
  const { access, setAuthAccess,refresh } = useContext(AuthContext)
  const authAxios = axios.create({
    baseURL: `${AUTH_URL}`,
  });

  const publicAxios = axios.create({
    baseURL: `${AUTH_URL}`,
  });

  authAxios.interceptors.request.use(
    config => {
        console.log("23fdsgffdsghhdf",access)
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${access}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = async failedRequest => {
    const token = refresh;
    const data = {
      refresh: token,
    };

    const options = {
      method: 'POST',
      data,
      url: `${ROOT_URL}/api/token/refresh/`,
    };
    
    return axios(options)
      .then(async tokenRefreshResponse => {
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.access;
        setAuthAccess(tokenRefreshResponse.data.access)
        return Promise.resolve();
      })
      .catch(e => {
        console.log("**refresh caatch",e)
        
        AuthContext.setAuthState({
          accessToken: null,
          refreshToken: null,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};
