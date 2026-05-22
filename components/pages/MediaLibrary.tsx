'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Search, 
  Plus, 
  FolderOpen, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  Star,
  Link
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const brandColor = "#430062";

interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  type: 'image' | 'video' | 'document';
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  client: string;
  tags: string[];
  isFavorite: boolean;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
}

// Mock Data
const folders: Folder[] = [
  { id: "1", name: "Brand Assets", count: 48, icon: <ImageIcon className="h-4 w-4" /> },
  { id: "2", name: "Lumina Fashion", count: 27, icon: <FolderOpen className="h-4 w-4" /> },
  { id: "3", name: "Nexus Tech", count: 19, icon: <FolderOpen className="h-4 w-4" /> },
  { id: "4", name: "Bloom Wellness", count: 34, icon: <FolderOpen className="h-4 w-4" /> },
  { id: "5", name: "Campaigns 2026", count: 62, icon: <FolderOpen className="h-4 w-4" /> },
];

const mockAssets: MediaAsset[] = [
  {
    id: "a1",
    fileName: "summer-hero-reel.mp4",
    url: "https://picsum.photos/id/1015/800/600",
    type: "video",
    fileSize: "42.8 MB",
    uploadedBy: "Sarah Chen",
    uploadedAt: "May 20, 2026",
    client: "Lumina Fashion",
    tags: ["reel", "summer", "hero"],
    isFavorite: true,
  },
  {
    id: "a2",
    fileName: "q2-report-infographic.png",
    url: "https://picsum.photos/id/201/800/600",
    type: "image",
    fileSize: "8.4 MB",
    uploadedBy: "Marcus Rivera",
    uploadedAt: "May 21, 2026",
    client: "Nexus Tech",
    tags: ["infographic", "report"],
    isFavorite: false,
  },
  {
    id: "a3",
    fileName: "wellness-moodboard.jpg",
    url: "https://picsum.photos/id/237/800/600",
    type: "image",
    fileSize: "12.1 MB",
    uploadedBy: "Aisha Patel",
    uploadedAt: "May 19, 2026",
    client: "Bloom Wellness",
    tags: ["moodboard"],
    isFavorite: true,
  },
  {
    id: "a4",
    fileName: "product-packaging-mockup.psd",
    url: "https://picsum.photos/id/106/800/600",
    type: "image",
    fileSize: "156 MB",
    uploadedBy: "David Kim",
    uploadedAt: "May 22, 2026",
    client: "Lumina Fashion",
    tags: ["mockup", "packaging"],
    isFavorite: false,
  },
];

export default function MediaLibrary() {
  const [assets, setAssets] = useState(mockAssets);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "document">("all");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate upload
    alert("Files uploaded successfully! (Demo)");
  };

  const openPreview = (asset: MediaAsset) => {
    setSelectedAsset(asset);
    setIsPreviewOpen(true);
  };

  const toggleFavorite = (id: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, isFavorite: !asset.isFavorite } : asset
    ));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="h-9 w-9 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: brandColor }}
              >
                A
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
                <p className="text-sm text-zinc-500">Centralized asset hub • 214 files</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input 
                placeholder="Search assets..." 
                className="pl-10 bg-zinc-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => fileInputRef.current?.click()}
              style={{ backgroundColor: brandColor }}
              className="text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              onChange={() => alert("Files selected (Demo)")} 
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Folders */}
        <div className="w-72 border-r border-zinc-200 bg-white p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-900">Folders</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <div 
              onClick={() => setSelectedFolder("all")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${selectedFolder === "all" ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
            >
              <FolderOpen className="h-5 w-5 text-zinc-500" />
              <span className="font-medium">All Assets</span>
              <Badge variant="secondary" className="ml-auto">{assets.length}</Badge>
            </div>

            {folders.map(folder => (
              <div 
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${selectedFolder === folder.id ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
              >
                {folder.icon}
                <span className="font-medium">{folder.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">{folder.count}</Badge>
              </div>
            ))}
          </div>

          <Separator className="my-8" />

          <div>
            <h4 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Recent Uploads</h4>
            <div className="space-y-4 text-sm">
              {assets.slice(0, 3).map(asset => (
                <div key={asset.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={asset.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium truncate">{asset.fileName}</p>
                    <p className="text-xs text-zinc-500">{asset.uploadedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-12 mb-10 text-center transition-all ${isDragging ? 'border-violet-400 bg-violet-50' : 'border-zinc-200 hover:border-zinc-300'}`}
          >
            <Upload className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <p className="font-medium text-lg">Drag &amp; drop files here</p>
            <p className="text-sm text-zinc-500 mt-1">or click to browse • Supports images, videos, PSDs</p>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredAssets.map((asset) => (
              <Card 
                key={asset.id}
                className="group bg-white border border-zinc-200 overflow-hidden rounded-3xl hover:shadow-md transition-all cursor-pointer"
                onClick={() => openPreview(asset)}
              >
                <div className="relative h-52 bg-zinc-100">
                  <img 
                    src={asset.url} 
                    alt={asset.fileName}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
                      className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm"
                    >
                      <Star className={`h-4 w-4 ${asset.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {asset.type}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="font-medium text-sm line-clamp-2 leading-tight mb-2">
                    {asset.fileName}
                  </p>
                  <div className="flex justify-between items-center text-xs text-zinc-500">
                    <span>{asset.client}</span>
                    <span>{asset.fileSize}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                <ImageIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="font-medium">No assets found</h3>
              <p className="text-zinc-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Preview Sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="w-full sm:max-w-4xl p-0">
          {selectedAsset && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-8 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl">{selectedAsset.fileName}</SheetTitle>
                    <p className="text-sm text-zinc-500 mt-1">{selectedAsset.client} • Uploaded by {selectedAsset.uploadedBy}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Link className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 p-8 flex items-center justify-center bg-zinc-950 relative">
                {selectedAsset.type === 'video' ? (
                  <video src={selectedAsset.url} controls className="max-h-[70vh] rounded-2xl" />
                ) : (
                  <img 
                    src={selectedAsset.url} 
                    alt={selectedAsset.fileName}
                    className="max-h-[70vh] rounded-2xl shadow-2xl" 
                  />
                )}
              </div>

              <div className="p-8 border-t bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <p className="text-xs text-zinc-500">FILE SIZE</p>
                    <p className="font-medium mt-1">{selectedAsset.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">UPLOADED</p>
                    <p className="font-medium mt-1">{selectedAsset.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">TAGS</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAsset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">ACTIONS</p>
                    <div className="flex gap-3 mt-3">
                      <Button size="sm" variant="outline">Attach to Content</Button>
                      <Button size="sm" variant="destructive" className="text-xs">
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}