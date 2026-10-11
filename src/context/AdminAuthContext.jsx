import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ADMIN_UID = "rMSPmEMDpghAW63Qp4Y2HvAAmZr2";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const authorized = currentUser?.uid === ADMIN_UID;

      setUser(currentUser);
      setIsAdmin(Boolean(authorized));
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, authLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}
