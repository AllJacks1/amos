'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  Upload, Search, Plus, Grid3X3, List, Download, 
  Star, Archive, Copy, MoreHorizontal, Image, Video, File 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const brandColor = "#430062";

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'creative';
  url: string;
  thumbnail: string;
  size: string;
  dimensions?: string;
  uploadedBy: string;
  uploadedAt: string;
  client: string;
  campaign: string;
  tags: string[];
  isFavorite: boolean;
  linkedCount: number;
}

const mockAssets: MediaAsset[] = [
  {
    id: "AS-7841",
    name: "Hero_Banner_Summer_2026.jpg",
    type: "image",
    url: "https://picsum.photos/id/1015/1200/800",
    thumbnail: "https://picsum.photos/id/1015/400/300",
    size: "4.8 MB",
    dimensions: "1920x1080",
    uploadedBy: "Sarah Chen",
    uploadedAt: "2026-05-20",
    client: "Acme Corp",
    campaign: "Summer Launch",
    tags: ["hero", "banner"],
    isFavorite: true,
    linkedCount: 3
  },
  {
    id: "AS-7842",
    name: "Product_Reel_Final.mp4",
    type: "video",
    url: "https://picsum.photos/id/106/1200/800",
    thumbnail: "https://picsum.photos/id/106/400/300",
    size: "28.4 MB",
    dimensions: "1080x1920",
    uploadedBy: "Alex Rivera",
    uploadedAt: "2026-05-21",
    client: "TechFlow Inc",
    campaign: "Q2 Growth",
    tags: ["reel", "product"],
    isFavorite: false,
    linkedCount: 1
  },
  {
    id: "AS-7843",
    name: "Testimonial_Carousel_v2.png",
    type: "image",
    url: "https://picsum.photos/id/201/1200/800",
    thumbnail: "https://picsum.photos/id/201/400/300",
    size: "2.1 MB",
    dimensions: "1200x1200",
    uploadedBy: "Marcus Torres",
    uploadedAt: "2026-05-22",
    client: "Acme Corp",
    campaign: "Customer Stories",
    tags: ["carousel", "testimonial"],
    isFavorite: true,
    linkedCount: 5
  },
  {
    id: "AS-7844",
    name: "Brand_Guidelines_2026.pdf",
    type: "creative",
    url: "#",
    thumbnail: "https://picsum.photos/id/237/400/300",
    size: "1.7 MB",
    uploadedBy: "Elena Vargas",
    uploadedAt: "2026-05-19",
    client: "Global Dynamics",
    campaign: "Brand Refresh",
    tags: ["guidelines"],
    isFavorite: false,
    linkedCount: 8
  },
];

const clientDistribution = [
  { name: 'Acme Corp', value: 42, fill: brandColor },
  { name: 'TechFlow Inc', value: 31, fill: '#6b21a8' },
  { name: 'Global Dynamics', value: 27, fill: '#a855f7' },
];

const kpiData = [
  { title: "Total Assets", value: "1,284", change: "+87 this month", icon: Image },
  { title: "Storage Used", value: "47.3 GB", change: "of 250 GB", icon: Archive },
  { title: "This Month", value: "164", change: "Uploads", icon: Upload },
  { title: "Most Used", value: "92", change: "Assets linked", icon: Star },
];

export default function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredAssets = useMemo(() => {
    return mockAssets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesClient = clientFilter === "All" || asset.client === clientFilter;
      const matchesType = typeFilter === "All" || asset.type === typeFilter.toLowerCase();
      const matchesFavorite = !favoritesOnly || asset.isFavorite;
      
      return matchesSearch && matchesClient && matchesType && matchesFavorite;
    });
  }, [searchTerm, clientFilter, typeFilter, favoritesOnly]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    alert("📤 Files uploaded successfully! (Demo - files would be processed here)");
  }, []);

  const toggleFavorite = (id: string) => {
    // In real app: update state / API
    alert(`⭐ Asset ${id} favorited`);
  };

  const copyLink = (asset: MediaAsset) => {
    alert(`🔗 Link copied: ${asset.url}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: brandColor }}
            >
              A
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Media Library</h1>
              <p className="text-zinc-500">Centralized Asset Management • 1.2k files</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Index
            </Button>
            
            <Button 
              style={{ backgroundColor: brandColor }}
              className="text-white"
              onClick={() => alert("Upload dialog would open here")}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Assets
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-8 pb-6 border-t pt-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search assets, tags, campaigns..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Clients</SelectItem>
              <SelectItem value="Acme Corp">Acme Corp</SelectItem>
              <SelectItem value="TechFlow Inc">TechFlow Inc</SelectItem>
              <SelectItem value="Global Dynamics">Global Dynamics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="creative">Creatives</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant={favoritesOnly ? "default" : "outline"} 
            size="sm"
            onClick={() => setFavoritesOnly(!favoritesOnly)}
          >
            <Star className="w-4 h-4 mr-2" />
            Favorites
          </Button>

          <div className="ml-auto flex items-center border rounded-xl p-1">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-zinc-500">{kpi.title}</CardTitle>
                    <kpi.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-semibold tracking-tighter">{kpi.value}</div>
                  <p className="text-sm text-zinc-500 mt-1">{kpi.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Drag & Drop Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 mb-8 text-center transition-all ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-zinc-200'}`}
          >
            <Upload className="mx-auto w-10 h-10 text-zinc-400 mb-4" />
            <p className="font-medium">Drop files here or click to upload</p>
            <p className="text-sm text-zinc-500 mt-1">PNG, JPG, MP4, PDF up to 100MB</p>
          </div>

          {/* Assets View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <Card 
                  key={asset.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="relative aspect-video bg-zinc-100">
                    <img 
                      src={asset.thumbnail} 
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-1">
                      {asset.type === 'video' && <Badge variant="secondary">🎥</Badge>}
                      <Badge variant="outline" className="bg-white/90 text-xs">{asset.size}</Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="font-medium line-clamp-2 text-sm leading-tight pr-2">
                        {asset.name}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
                        className="text-amber-500"
                      >
                        <Star className={`w-4 h-4 ${asset.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="text-xs text-zinc-500 mt-3 flex justify-between">
                      <span>{asset.client}</span>
                      <span>{asset.uploadedAt}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs h-8"
                        onClick={(e) => { e.stopPropagation(); copyLink(asset); }}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Link
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs h-8"
                        onClick={(e) => { e.stopPropagation(); alert("Downloading..."); }}
                      >
                        <Download className="w-3 h-3 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-medium text-sm">Asset</th>
                      <th className="text-left py-4 px-6 font-medium text-sm">Client / Campaign</th>
                      <th className="text-left py-4 px-6 font-medium text-sm">Type</th>
                      <th className="text-left py-4 px-6 font-medium text-sm">Size</th>
                      <th className="text-left py-4 px-6 font-medium text-sm">Uploaded</th>
                      <th className="w-32"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr 
                        key={asset.id} 
                        className="border-b hover:bg-zinc-50 cursor-pointer group"
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-10 bg-zinc-100 rounded-lg overflow-hidden">
                              <img src={asset.thumbnail} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{asset.name}</div>
                              {asset.dimensions && <div className="text-xs text-zinc-500">{asset.dimensions}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div>{asset.client}</div>
                            <div className="text-xs text-zinc-500">{asset.campaign}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="capitalize">{asset.type}</Badge>
                        </td>
                        <td className="py-4 px-6 text-sm">{asset.size}</td>
                        <td className="py-4 px-6 text-sm text-zinc-500">
                          {asset.uploadedBy}<br />
                          <span className="text-xs">{asset.uploadedAt}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={(e) => {e.stopPropagation(); copyLink(asset);}}>
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={(e) => {e.stopPropagation(); toggleFavorite(asset.id);}}>
                              <Star className={`w-4 h-4 ${asset.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {filteredAssets.length === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mb-6">
                <Image className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold">No assets found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Storage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={clientDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    dataKey="value"
                  >
                    {clientDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-3">
                {clientDistribution.map((c, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.fill }} />
                      {c.name}
                    </div>
                    <span className="font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-72">
                {mockAssets.slice(0, 4).map((asset, idx) => (
                  <React.Fragment key={asset.id}>
                    <div className="flex gap-3 py-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border">
                        <img src={asset.thumbnail} className="object-cover w-full h-full" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{asset.name}</p>
                        <p className="text-xs text-zinc-500">{asset.client}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">{asset.uploadedAt}</p>
                      </div>
                    </div>
                    {idx < 3 && <Separator />}
                  </React.Fragment>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Images</span>
                <span className="font-medium">682</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Videos</span>
                <span className="font-medium">241</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Documents</span>
                <span className="font-medium">361</span>
              </div>
              <Separator />
              <div className="pt-2 text-xs text-emerald-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                All assets are backed up
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Asset Detail Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between pr-8">
                  {selectedAsset.name}
                  <Badge variant="outline">{selectedAsset.size}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="mt-2">
                <div className="rounded-3xl overflow-hidden border mb-6">
                  <img 
                    src={selectedAsset.url} 
                    alt={selectedAsset.name}
                    className="w-full h-auto max-h-[420px] object-contain bg-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">CLIENT</div>
                      <div className="font-medium">{selectedAsset.client}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">CAMPAIGN</div>
                      <div className="font-medium">{selectedAsset.campaign}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">UPLOADED BY</div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>{selectedAsset.uploadedBy.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{selectedAsset.uploadedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-zinc-500 mb-3">TAGS</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.tags.map(tag => (
                        <Badge key={tag} variant="secondary">#{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button className="flex-1" style={{ backgroundColor: brandColor }}>
                  Attach to Content
                </Button>
                <Button variant="outline" className="flex-1">Download Original</Button>
                <Button variant="outline" onClick={() => copyLink(selectedAsset)}>
                  <Copy className="mr-2 w-4 h-4" /> Copy Link
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}