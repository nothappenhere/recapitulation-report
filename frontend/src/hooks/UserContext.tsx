import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type User = {
  _id: string;
  name: string;
  username: string;
  role: string;
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/check-auth");
        setUser(res.data?.data?.user);
      } catch (err) {
        const message = err.response?.data?.message
          ? `${err.response?.data?.message}!`
          : "";
        toast.error(`${message}\nPlease login first.`, {
          duration: 5000,
        });
        setUser(null);
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Skeleton className="bg-gray-100 aspect-video rounded-xl" />
              <Skeleton className="bg-gray-100 aspect-video rounded-xl" />
              <Skeleton className="bg-gray-100 aspect-video rounded-xl" />
            </div>
            <Skeleton className="bg-gray-100 aspect-video rounded-xl" />
          </div>
        </>
      ) : (
        <UserContext.Provider value={{ user, setUser }}>
          {children}
        </UserContext.Provider>
      )}
    </>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
