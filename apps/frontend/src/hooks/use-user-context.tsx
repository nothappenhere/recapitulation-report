/* eslint-disable react-refresh/only-export-components */
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@rzkyakbr/libs";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

type User = {
  _id: string;
  position: string;
  fullName: string;
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
        const error = err as AxiosError<{ message?: string }>;
        const message = error.response?.data?.message
          ? `${error.response?.data?.message}!`
          : "";
        toast.error(`${message}\nSilakan login terlebih dahulu.`, {
          duration: 5000,
        });

        navigate("/auth/login");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Skeleton className="bg-neutral-100 aspect-video rounded-xl" />
              <Skeleton className="bg-neutral-100 aspect-video rounded-xl" />
              <Skeleton className="bg-neutral-100 aspect-video rounded-xl" />
            </div>
            <Skeleton className="bg-neutral-100 aspect-video rounded-xl" />
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
