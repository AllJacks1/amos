import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  status: string;
  first_login: boolean;
}

interface UsersStore {
  users: User[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchUsers: (options?: {
    force?: boolean;
    staleTime?: number;
  }) => Promise<void>;

  setUsers: (users: User[]) => void;

  addUser: (user: User) => void;

  updateUser: (updatedUser: User) => void;

  removeUser: (id: string) => void;

  clearUsers: () => void;

  logout: () => void;
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [],
      loading: false,
      initialized: false,
      error: null,
      lastFetched: null,

      fetchUsers: async (options = {}) => {
        const { force = false, staleTime = 1000 * 60 * 5 } = options;

        const { users, initialized, loading, lastFetched } = get();

        // prevent duplicate simultaneous requests
        if (loading) return;

        // check if cached data is still fresh
        const isFresh = lastFetched && Date.now() - lastFetched < staleTime;

        if (!force && initialized && users.length > 0 && isFresh) {
          return;
        }

        try {
          set({
            loading: true,
            error: null,
          });

          const res = await fetch("/api/accounts/fetch-users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => null);

            throw new Error(errorData?.error || "Failed to fetch users");
          }

          const data: User[] = await res.json();

          set({
            users: data,
            initialized: true,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      setUsers: (users) => {
        set({
          users,
          initialized: true,
          lastFetched: Date.now(),
        });
      },

      addUser: (user) => {
        set((state) => ({
          users: [user, ...state.users],
        }));
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        }));
      },

      removeUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      clearUsers: () => {
        set({
          users: [],
          initialized: false,
          error: null,
          lastFetched: null,
        });
      },

      logout: () => {
        get().clearUsers();

        set({
          loading: false,
        });

        localStorage.removeItem("users-storage");
      },
    }),
    {
      name: "users-storage",

      // only persist important data
      partialize: (state) => ({
        users: state.users,
        initialized: state.initialized,
        lastFetched: state.lastFetched,
      }),
    },
  ),
);
