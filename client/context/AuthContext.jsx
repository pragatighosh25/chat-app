import { createContext } from "react";
import axios from "axios";

const backendUrl= import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [authUser, setAuthUser] = useState(null);
  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser
  };

  // Logic to fetch user data and manage authentication state

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}