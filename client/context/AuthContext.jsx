import { createContext } from "react";
import axios from "axios";

const backendUrl= import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  //check if user is authenticated and if so, set the user data and connect to socket
  const checkAuth = async () => {
    if (token) {
      try {
        const {data} = await axios.get('/auth/check');
        if(data.success) {
          setAuthUser(data.user);
        }
        // Initialize socket connection here if needed
      } catch (error) {
        console.error("Authentication error:", error);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
  };

  // Logic to fetch user data and manage authentication state

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}