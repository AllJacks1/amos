import { create } from "zustand";

export interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
  status: "review" | "approval" | "approved" | "scheduled" | "posted";
  publishDate: string;
  client: string;
  assignedTo: string;
  driveLinks: string[];
  pillar: string;
}

interface ContentState {
  contents: ContentItem[];
  loading: boolean;
  error: string | null;

  fetchContents: () => Promise<void>;
  addContent: (content: ContentItem) => void;
  updateStatus: (id: string, status: ContentItem["status"]) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  loading: false,
  error: null,

  fetchContents: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/contents/fetch");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      set({ contents: data.contents });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      set({ loading: false });
    }
  },

  addContent: (content) => {
    set((state) => ({
      contents: [content, ...state.contents],
    }));
  },

  updateStatus: (id, status) => {
    set((state) => ({
      contents: state.contents.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  },
}));
