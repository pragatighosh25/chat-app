import { createContext, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useState } from "react";

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
        const {data} = await axios.get('api/auth/check');
        if(data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
        // Initialize socket connection here if needed
      } catch (error) {
        toast.error(error.message || "Authentication failed");
      }
    }
  };

  //Login function to handle user autheentication and socket connection
  const login = async (state, credentials) => {
    try {
      console.log("🚀 Credentials being sent:", credentials);
      const { data } = await axios.post(`api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem('token', data.token);
        toast.success(data.message || "Login successful");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  //Logout function to handle user logout and disconnect socket
  const logout = async () => {

      localStorage.removeItem('token');
      setAuthUser(null);
      setToken(null);
      setOnlineUsers([]);
      axios.defaults.headers.common["token"] = null;
      toast.success("Logout successful");
      socket.disconnect();
  };

  //update profile function to handle user profile update

  const updateProfile = async (userData) => {
    try {
      
      const { data } = await axios.put('api/auth/update-profile', userData);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message || "Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    }
  };








  //connect socket function to handle socket connection and online users update

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
        token: token
      }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnline", (userIds) => {
      setOnlineUsers(userIds)
    });
  };


  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    authUser,
    token,
    setAuthUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile
  };

  // Logic to fetch user data and manage authentication state

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};