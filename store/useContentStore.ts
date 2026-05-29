import { create } from "zustand";

export interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platforms: string[]; // ← Changed to array
  contentTypes: string[]; // ← Changed to array
  status: "review" | "revise" | "approved" | "scheduled" | "posted";
  publishDate: string;
  client: string;
  assignedTo: string;
  driveLinks: string[];
  pillar: string;

  priority?: string | null;
  revisionDueDate?: string | null;
  revisionCount?: number;

  revisionNotes?: {
    commenter: string;
    comment: string;
    created_at: string;
  }[];
}

interface ContentState {
  contents: ContentItem[];
  loading: boolean;
  error: string | null;

  fetchContents: () => Promise<void>;
  addContent: (content: any) => void; // Keep `any` or define proper type
  updateStatus: (id: string, status: ContentItem["status"]) => void;

  clearContents: () => void;
}

/**
 * NORMALIZER
 */
const mapContent = (item: any): ContentItem => ({
  id: item.id,

  title: item.title || item.content_title || "",

  caption: item.caption || "",

  // Updated for arrays
  platforms: Array.isArray(item.platforms)
    ? item.platforms
    : item.platform
      ? [item.platform]
      : [],

  contentTypes:
    Array.isArray(item.contentTypes) || Array.isArray(item.content_types)
      ? item.contentTypes || item.content_types
      : item.contentType || item.content_type
        ? [item.contentType || item.content_type]
        : [],

  status: item.status || "review",

  publishDate: item.publishDate || item.publish_date || "",

  client: item.client  || "",

  assignedTo:item.assignedTo || "",

  driveLinks: item.driveLinks || item.gdrive_links || [],

  pillar: item.pillar || item.content_pillar || "",

  priority: item.priority || null,

  revisionDueDate: item.revisionDueDate || item.revision_due_date || null,

  revisionCount: item.revisionCount || item.revision_count || 0,

  revisionNotes: item.revisionNotes || item.revision_notes || [],
});

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  loading: false,
  error: null,

  fetchContents: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/contents/fetch");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch contents");
      }

      const normalizedContents = (data.contents || []).map(mapContent);

      set({ contents: normalizedContents });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      set({ loading: false });
    }
  },

  addContent: (content) => {
    const normalized = mapContent(content);
    set((state) => ({
      contents: [normalized, ...state.contents],
    }));
  },

  updateStatus: (id, status) => {
    set((state) => ({
      contents: state.contents.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  },

  clearContents: () => {
    set({
      contents: [],
      loading: false,
      error: null,
    });
  },
}));
