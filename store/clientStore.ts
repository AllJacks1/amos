import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Client {
  id: string;
  created_at: string;
  company_logo: string;
  company_name: string;
  industry: string;
  primary_contact_name: string;
  email: string;
  status: "active" | "onboarding" | "paused";
  first_login: boolean;
  role: string;
}

interface ClientStore {
  clients: Client[];
  loading: boolean;
  fetched: boolean;

  fetchClients: () => Promise<void>;

  addClient: (client: Client) => void;

  clearClients: () => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      loading: false,
      fetched: false,

      fetchClients: async () => {
        // prevent duplicate fetches
        if (get().fetched) return;

        try {
          set({ loading: true });

          const res = await fetch("/api/accounts/fetch-clients");

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Failed to fetch clients");
          }

          set({
            clients: data.clients,
            fetched: true,
          });
        } catch (error) {
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },

      addClient: (client) => {
        set((state) => ({
          clients: [client, ...state.clients],
        }));
      },

      clearClients: () => {
        set({
          clients: [],
          fetched: false,
        });
      },
    }),
    {
      name: "client-store",
    },
  ),
);
