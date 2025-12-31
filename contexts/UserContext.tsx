import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { initializeValidUserId } from "@/lib/user";
import { storage } from "@/services/storage";

interface UserContextType {
  userId: string;
  allUsers: string[];
  isLoading: boolean;
  setUserId: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string>("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await initializeValidUserId();
      setUserIdState(result.userId);
      setAllUsers(result.allUsers);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const setUserId = useCallback(async (id: string) => {
    await storage.setUserId(id);
    setUserIdState(id);
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        allUsers,
        isLoading,
        setUserId,
        refresh: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
