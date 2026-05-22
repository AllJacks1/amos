'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const brandColor = "#430062";

interface ContentItem {
  id: string;
  title: string;
  caption: string;
  platform: 'Instagram' | 'Facebook' | 'Google' | 'LinkedIn';
  type: 'Static' | 'Carousel' | 'Reel' | 'Story';
  status: 'Draft' | 'For Approval' | 'Approved' | 'Posted';
  scheduleDate: string;
  publishedDate?: string;
  image: string;
  designer: string;
  copywriter: string;
  comments: number;
  clientComments?: string;
}

const mockContent: ContentItem[] = [
  {
    id: "POST-8921",
    title: "Q3 Product Launch Teaser",
    caption: "Excited to share what's coming next month. Our biggest update yet is almost here...",
    platform: "Instagram",
    type: "Reel",
    status: "For Approval",
    scheduleDate: "2026-05-28",
    image: "https://picsum.photos/id/1015/600/400",
    designer: "Sarah Chen",
    copywriter: "Marcus Torres",
    comments: 3,
    clientComments: "Looks amazing! Just make the text a bit larger."
  },
  {
    id: "POST-8922",
    title: "Client Success Story: XYZ Corp",
    caption: "How XYZ Corp increased their conversion rate by 47% using our platform.",
    platform: "LinkedIn",
    type: "Carousel",
    status: "Approved",
    scheduleDate: "2026-05-29",
    image: "https://picsum.photos/id/106/600/400",
    designer: "Alex Rivera",
    copywriter: "Elena Vargas",
    comments: 1
  },
  {
    id: "POST-8923",
    title: "Weekly Tip: SEO Best Practices 2026",
    caption: "Thread: 5 things every marketer should know about Google's new algorithm update.",
    platform: "Facebook",
    type: "Static",
    status: "Draft",
    scheduleDate: "2026-06-01",
    image: "https://picsum.photos/id/201/600/400",
    designer: "Sarah Chen",
    copywriter: "Marcus Torres",
    comments: 0
  },
  {
    id: "POST-8924",
    title: "Behind the Scenes: Design Process",
    caption: "A day in the life of our creative team.",
    platform: "Instagram",
    type: "Reel",
    status: "Posted",
    scheduleDate: "2026-05-20",
    publishedDate: "2026-05-20",
    image: "https://picsum.photos/id/237/600/400",
    designer: "Alex Rivera",
    copywriter: "Elena Vargas",
    comments: 8
  },
];

const statusColors = {
  Draft: "bg-gray-100 text-gray-700 border-gray-200",
  "For Approval": "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Posted: "bg-blue-100 text-blue-700 border-blue-200",
};

const platformColors: Record<string, string> = {
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  Google: "#4285F4",
  LinkedIn: "#0A66C2",
};

const kpiData = [
  { 
    title: "Total Scheduled", 
    value: "47", 
    change: "+12%", 
    trend: "up",
    icon: CalendarIcon 
  },
  { 
    title: "Pending Approvals", 
    value: "9", 
    change: "-3", 
    trend: "down",
    icon: Clock 
  },
  { 
    title: "Approved This Week", 
    value: "23", 
    change: "+18%", 
    trend: "up",
    icon: CheckCircle2 
  },
  { 
    title: "Posted This Month", 
    value: "31", 
    change: "+4", 
    trend: "up",
    icon: TrendingUp 
  },
];

const platformDistribution = [
  { name: 'Instagram', value: 42, fill: '#E1306C' },
  { name: 'Facebook', value: 28, fill: '#1877F2' },
  { name: 'LinkedIn', value: 19, fill: '#0A66C2' },
  { name: 'Google', value: 11, fill: '#4285F4' },
];

const typeDistribution = [
  { name: 'Reel', value: 35 },
  { name: 'Carousel', value: 28 },
  { name: 'Static', value: 25 },
  { name: 'Story', value: 12 },
];

export default function MasterContentCalendar() {
  const [activeTab, setActiveTab] = useState<"table" | "kanban" | "calendar">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredContent = useMemo(() => {
    return mockContent.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesPlatform = platformFilter === "All" || item.platform === platformFilter;
      
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [searchTerm, statusFilter, platformFilter]);

  const kanbanColumns = {
    Draft: filteredContent.filter(i => i.status === "Draft"),
    "For Approval": filteredContent.filter(i => i.status === "For Approval"),
    Approved: filteredContent.filter(i => i.status === "Approved"),
    Posted: filteredContent.filter(i => i.status === "Posted"),
  };

  const upcomingPosts = [...mockContent]
    .sort((a, b) => new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: brandColor }}
              >
                A
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Content Calendar</h1>
                <p className="text-zinc-500 mt-1">Master Content Operating System • Q2 2026</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: brandColor }} className="text-white hover:bg-[#3a0055]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Content</DialogTitle>
                  <DialogDescription>
                    Add a new piece of content to the production pipeline.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Campaign name or post title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reel">Reel</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="static">Static</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Caption Preview</Label>
                    <Textarea placeholder="Write caption..." className="h-24" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                  <Button style={{ backgroundColor: brandColor }} onClick={() => setIsCreateModalOpen(false)}>
                    Create &amp; Assign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-6 flex flex-wrap items-center gap-3 border-t pt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-zinc-400 w-4 h-4" />
            <Input 
              placeholder="Search content..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="For Approval">For Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Posted">Posted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Platforms</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-sm hover:shadow transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-zinc-500">{kpi.title}</CardTitle>
                <kpi.icon className="w-5 h-5 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-semibold tracking-tighter">{kpi.value}</div>
                <div className={`text-sm flex items-center gap-1 mt-1 ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change} from last period
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              {/* TABLE VIEW */}
              <TabsContent value="table" className="space-y-6">
                <Card className="shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="cursor-pointer hover:bg-zinc-50"
                          onClick={() => setSelectedContent(item)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border">
                                <img src={item.image} alt="" className="object-cover w-full h-full" />
                              </div>
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-zinc-500 line-clamp-1">{item.caption}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{ color: platformColors[item.platform], borderColor: platformColors[item.platform] + '40' }}>
                              {item.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(item.scheduleDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[item.status]}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex -space-x-2">
                              <Avatar className="w-7 h-7 border-2 border-white">
                                <AvatarFallback className="text-[10px]">{item.designer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setSelectedContent(item); }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredContent.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-zinc-400" />
                      </div>
                      <p className="font-medium">No content found</p>
                      <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* KANBAN VIEW */}
              <TabsContent value="kanban">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {Object.entries(kanbanColumns).map(([columnName, items]) => (
                    <div key={columnName} className="bg-white rounded-3xl p-5 shadow-sm border">
                      <div className="flex items-center justify-between mb-6">
                        <div className="font-semibold">{columnName}</div>
                        <Badge variant="secondary">{items.length}</Badge>
                      </div>
                      <div className="space-y-4 min-h-[500px]">
                        {items.map(item => (
                          <Card 
                            key={item.id} 
                            className="p-4 cursor-pointer hover:shadow-md transition-all"
                            onClick={() => setSelectedContent(item)}
                          >
                            <div className="rounded-2xl overflow-hidden mb-4 h-40 relative">
                              <img src={item.image} alt="" className="object-cover w-full h-full" />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-black text-xs">{item.type}</Badge>
                              </div>
                            </div>
                            <div className="font-medium text-sm line-clamp-2 mb-2">{item.title}</div>
                            <div className="flex justify-between text-xs text-zinc-500">
                              <span>{item.platform}</span>
                              <span>{new Date(item.scheduleDate).toLocaleDateString()}</span>
                            </div>
                          </Card>
                        ))}
                        {items.length === 0 && (
                          <div className="h-40 border border-dashed rounded-2xl flex items-center justify-center text-zinc-400 text-sm">
                            No items
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* CALENDAR VIEW */}
              <TabsContent value="calendar">
                <Card className="p-8">
                  <div className="flex justify-between mb-8">
                    <h3 className="text-xl font-semibold">May 2026</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">← Previous</Button>
                      <Button variant="outline" size="sm">Next →</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-px bg-zinc-200 rounded-3xl overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-white p-4 text-center text-sm font-medium text-zinc-500">
                        {day}
                      </div>
                    ))}
                    
                    {/* Simplified calendar cells with sample data */}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i - 2;
                      const hasPost = [25, 28, 29, 31].includes(day);
                      return (
                        <div 
                          key={i} 
                          className="bg-white p-3 min-h-[140px] border-t hover:bg-zinc-50 transition-colors cursor-pointer relative"
                        >
                          <div className="text-sm text-right text-zinc-400">{day > 0 ? day : ''}</div>
                          {hasPost && (
                            <div className="mt-3 space-y-2">
                              {day === 28 && (
                                <div className="text-[10px] bg-pink-100 text-pink-700 px-2 py-1 rounded">Reel • IG</div>
                              )}
                              {day === 29 && (
                                <div className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded">Carousel • LI</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-96 space-y-6">
            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      dataKey="value"
                    >
                      {platformDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-sm mt-4">
                  {platformDistribution.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: p.fill}} />
                      <span>{p.name}</span>
                      <span className="text-zinc-400">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Upcoming This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  {upcomingPosts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                      <div className="flex gap-4 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border">
                          <img src={post.image} alt="" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                            <Badge variant="outline" className="text-[10px]">{post.platform}</Badge>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            {new Date(post.scheduleDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {idx < upcomingPosts.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Content Brief
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" /> Request Client Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" /> Generate Monthly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Detail Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>{selectedContent.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-1">
                      <Badge style={{ backgroundColor: platformColors[selectedContent.platform] + '20', color: platformColors[selectedContent.platform] }}>
                        {selectedContent.platform}
                      </Badge>
                      <Badge variant="secondary">{selectedContent.type}</Badge>
                      <span className="text-xs text-zinc-500">{selectedContent.id}</span>
                    </DialogDescription>
                  </div>
                  <Badge className={statusColors[selectedContent.status]}>{selectedContent.status}</Badge>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-auto">
                <div className="aspect-video rounded-3xl overflow-hidden border mb-6 relative">
                  <img 
                    src={selectedContent.image} 
                    alt={selectedContent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Caption</h4>
                    <p className="text-sm leading-relaxed text-zinc-600">{selectedContent.caption}</p>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Designer</div>
                        <div className="font-medium">{selectedContent.designer}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Copywriter</div>
                        <div className="font-medium">{selectedContent.copywriter}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Client Feedback</h4>
                    {selectedContent.clientComments ? (
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-sm">
                        “{selectedContent.clientComments}”
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">No client comments yet.</p>
                    )}

                    <div className="mt-8">
                      <div className="font-medium mb-3">Actions</div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => alert("Requesting revision...")}
                        >
                          Request Revision
                        </Button>
                        <Button 
                          className="flex-1" 
                          style={{ backgroundColor: brandColor }}
                          onClick={() => alert("Content approved!")}
                        >
                          Approve for Publishing
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}