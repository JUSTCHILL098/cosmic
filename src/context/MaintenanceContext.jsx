import { createContext, useContext, useState, useEffect } from "react";

const MaintenanceContext = createContext();

const ADMIN_KEY = "cosmic_admin_token";
const MAINT_KEY = "cosmic_maintenance";
const MSG_KEY   = "cosmic_maintenance_msg";
// Simple hardcoded admin password — change this
const ADMIN_PASSWORD = "cosmic2025";

export const MaintenanceProvider = ({ children }) => {
  const [isAdmin,      setIsAdmin]      = useState(() => localStorage.getItem(ADMIN_KEY) === "true");
  const [maintenance,  setMaintenance]  = useState(() => localStorage.getItem(MAINT_KEY) === "true");
  const [message,      setMessage]      = useState(() => localStorage.getItem(MSG_KEY) || "We're performing scheduled maintenance. We'll be back shortly!");

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  const toggleMaintenance = (val) => {
    const next = val !== undefined ? val : !maintenance;
    localStorage.setItem(MAINT_KEY, String(next));
    setMaintenance(next);
  };

  const updateMessage = (msg) => {
    localStorage.setItem(MSG_KEY, msg);
    setMessage(msg);
  };

  return (
    <MaintenanceContext.Provider value={{ isAdmin, maintenance, message, login, logout, toggleMaintenance, updateMessage }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
