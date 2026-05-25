'use client';

import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function GlobalHeader() {
  return (
    <header className="h-16 border-b border-zinc-200 bg-white/95 backdrop-blur-lg sticky top-0 z-40 hidden lg:flex items-center px-8">
      <div className="flex-1 flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 bg-zinc-50 border-zinc-200 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Quick Action
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white">
            3
          </div>
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}