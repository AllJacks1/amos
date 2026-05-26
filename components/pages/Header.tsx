"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsersStore } from "@/store/useUsersStore";
import { useContentStore } from "@/store/useContentStore";
import { useClientStore } from "@/store/clientStore";
import { useRouter } from "next/navigation";

export default function GlobalHeader() {
  const logout = useUsersStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    useClientStore.getState().logout();
    useContentStore.getState().clearContents();
    router.push("/");
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/95 backdrop-blur-lg sticky top-0 z-40 hidden lg:flex items-center justify-end px-8">
      {/* <div className="flex-1 flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 bg-zinc-50 border-zinc-200 focus-visible:ring-1"
          />
        </div>
      </div> */}

      <div className="flex items-center gap-4">
        {/* <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Quick Action
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white">
            3
          </div>
        </Button> */}

        <div className="shrink-0 border-t border-zinc-200 p-4">
          <div className="flex items-center gap-3 rounded-2xl p-2  min-w-0">
            <Avatar className="h-9 w-9 border border-zinc-100 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Alex Rivera</div>

              <div className="text-xs text-emerald-600 truncate">
                Admin • Marketing
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 hover:bg-zinc-100 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
