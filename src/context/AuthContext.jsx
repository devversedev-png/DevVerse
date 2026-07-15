import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("devverse_user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("devverse_token");
  });

  const [loading, setLoading] = useState(true);

  /* ==============================
     RESTORE LOGIN SESSION
  ============================== */

  useEffect(() => {
    const savedUser = localStorage.getItem("devverse_user");
    const savedToken = localStorage.getItem("devverse_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  /* ==============================
     LOGIN
  ============================== */

  const login = (userData, authToken) => {
    localStorage.setItem(
      "devverse_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "devverse_token",
      authToken
    );

    setUser(userData);
    setToken(authToken);
  };

  /* ==============================
     LOGOUT
  ============================== */

  const logout = () => {
    localStorage.removeItem("devverse_user");
    localStorage.removeItem("devverse_token");

    setUser(null);
    setToken(null);
  };

  /* ==============================
     AUTH VALUES
  ============================== */

  const isAuthenticated = Boolean(user && token);

  const isAdmin =
    isAuthenticated && user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ==============================
   CUSTOM AUTH HOOK
============================== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;