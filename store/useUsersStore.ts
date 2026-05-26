import { create } from "zustand";

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

  clearUsers: () => void;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  users: [],
  loading: false,
  initialized: false,
  error: null,
  lastFetched: null,

  fetchUsers: async (options = {}) => {
    const { force = false, staleTime = 1000 * 60 * 5 } = options;
    // default staleTime = 5 minutes

    const { users, initialized, loading, lastFetched } = get();

    // Prevent duplicate simultaneous requests
    if (loading) return;

    // If data already exists and is still fresh, skip API call
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

        // Prevent browser caching issues
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

  clearUsers: () => {
    set({
      users: [],
      initialized: false,
      error: null,
      lastFetched: null,
    });
  },
}));
