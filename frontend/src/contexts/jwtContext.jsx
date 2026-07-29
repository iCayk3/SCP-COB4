import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import axios from 'axios';
// CUSTOM LOADING COMPONENT
import { LoadingProgress } from '@/components/loader';
const API_URL = import.meta.env.VITE_API_URL || '/api';

// ==============================================================

// ==============================================================

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};
const normalizeUser = user => {
  if (!user) return null;
  const profile = user.perfil || user.role || '';
  const role = profile === 'ADMINISTRADOR' ? 'administrator' : profile.toLowerCase();
  return {
    ...user,
    role,
    name: user.nome || user.name,
    email: user.identificador || user.email
  };
};
axios.defaults.withCredentials = true;
const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    default:
      return state;
  }
};

// ==============================================================

// ==============================================================

export const AuthContext = createContext({});
export function AuthProvider({
  children
}) {
  localStorage.removeItem('accessToken');
  const [state, dispatch] = useReducer(reducer, initialState);

  // USER LOGIN HANDLER
  const login = useCallback(async (identificador, senha) => {
    const {
      data
    } = await axios.post(`${API_URL}/auth/login`, {
      identificador,
      senha
    });
    dispatch({
      type: 'LOGIN',
      payload: {
        user: normalizeUser(data.usuario),
        isAuthenticated: true
      }
    });
  }, []);

  // USER LOGOUT HANDLER
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } finally {
      dispatch({
        type: 'LOGOUT',
        payload: {
          user: null,
          isAuthenticated: false
        }
      });
    }
  }, []);

  const changePassword = useCallback(async (senhaAtual, novaSenha) => {
    await axios.put(`${API_URL}/auth/senha`, { senhaAtual, novaSenha }, { withCredentials: true });
    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
        isAuthenticated: false
      }
    });
  }, []);
  const checkCurrentUser = useCallback(async () => {
    try {
        const { data } = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        dispatch({
          type: 'INIT',
          payload: {
            user: normalizeUser(data),
            isAuthenticated: true
          }
        });
    } catch (err) {
      dispatch({
        type: 'INIT',
        payload: {
          user: null,
          isAuthenticated: false
        }
      });
    }
  }, []);
  useEffect(() => {
    checkCurrentUser();
  }, []);
  useEffect(() => {
    const expire = () => dispatch({
      type: 'LOGOUT',
      payload: { user: null, isAuthenticated: false }
    });
    window.addEventListener('sgc-session-expired', expire);
    return () => window.removeEventListener('sgc-session-expired', expire);
  }, []);
  const contextValue = useMemo(() => ({
    ...state,
    method: 'JWT',
    login,
    signInWithEmail: login,
    changePassword,
    logout
  }), [state, login, changePassword, logout]);
  if (!state.isInitialized) return <LoadingProgress />;
  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
