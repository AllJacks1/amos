'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar, CheckCircle, Clock, TrendingUp, Users, 
  MessageCircle, Eye, Star 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const brandColor = "#430062";

interface ClientContent {
  id: string;
  title: string;
  caption: string;
  platform: string;
  type: string;
  publishDate: string;
  image: string;
  status: 'Approved' | 'Pending Approval';
  engagement?: number;
}

const mockApprovedContent: ClientContent[] = [
  {
    id: "C-7841",
    title: "Summer Collection Launch",
    caption: "Discover our boldest collection yet. Premium materials meet modern design.",
    platform: "Instagram",
    type: "Reel",
    publishDate: "May 28, 2026",
    image: "https://picsum.photos/id/1015/800/600",
    status: "Approved",
    engagement: 21.4
  },
  {
    id: "C-7842",
    title: "Client Success Story",
    caption: "How TechFlow increased conversions by 47% in just 60 days.",
    platform: "LinkedIn",
    type: "Carousel",
    publishDate: "May 30, 2026",
    image: "https://picsum.photos/id/106/800/600",
    status: "Approved",
    engagement: 18.7
  },
  {
    id: "C-7843",
    title: "Weekly Marketing Tip",
    caption: "3 strategies to improve your email open rates in 2026.",
    platform: "Facebook",
    type: "Static",
    publishDate: "June 2, 2026",
    image: "https://picsum.photos/id/201/800/600",
    status: "Pending Approval",
    engagement: 0
  },
];

const performanceTrend = [
  { week: 'W1', reach: 12400, er: 14.2 },
  { week: 'W2', reach: 18700, er: 19.8 },
  { week: 'W3', reach: 15600, er: 17.3 },
  { week: 'W4', reach: 22300, er: 22.1 },
];

const platformBreakdown = [
  { name: 'Instagram', value: 58, fill: '#E1306C' },
  { name: 'LinkedIn', value: 27, fill: '#0A66C2' },
  { name: 'Facebook', value: 15, fill: '#1877F2' },
];

export default function ClientDashboardPortal() {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "approvals" | "reports">("overview");
  const [selectedContent, setSelectedContent] = useState<ClientContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContent = useMemo(() => {
    return mockApprovedContent.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const pendingApprovals = mockApprovedContent.filter(c => c.status === "Pending Approval");
  const approvedCount = mockApprovedContent.length - pendingApprovals.length;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: brandColor }}
            >
              A
            </div>
            <div>
              <h1 className="font-semibold text-2xl">Acme Corp Portal</h1>
              <p className="text-xs text-zinc-500 -mt-1">Powered by AXIS Marketing OS</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems active
            </div>
            <Button variant="outline" size="sm">Contact Manager</Button>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="px-8 border-t">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
            <TabsList className="h-12 bg-transparent p-0 border-b w-full justify-start rounded-none">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-700 rounded-none">Overview</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-700 rounded-none">Content</TabsTrigger>
              <TabsTrigger value="approvals" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-700 rounded-none">Approvals</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:border-b-2 data-[state=active]:border-violet-700 rounded-none">Reports</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-500">Approved This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-semibold tracking-tighter text-emerald-700">{approvedCount}</div>
                  <p className="text-sm text-zinc-500 mt-2">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-500">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-semibold tracking-tighter">{pendingApprovals.length}</div>
                  <p className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Due this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-500">Monthly Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-semibold tracking-tighter">68.4k</div>
                  <div className="flex items-center text-emerald-600 text-sm mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" /> +31% growth
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-500">Avg Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-semibold tracking-tighter">19.8%</div>
                  <p className="text-sm text-zinc-500 mt-2">Excellent performance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Approved Content */}
              <div className="lg:col-span-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recently Approved Content</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("content")}>View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockApprovedContent.slice(0, 4).map((item) => (
                        <div 
                          key={item.id}
                          className="border rounded-3xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                          onClick={() => setSelectedContent(item)}
                        >
                          <div className="relative aspect-video">
                            <img src={item.image} alt="" className="object-cover w-full h-full" />
                            <Badge className="absolute top-3 right-3 bg-white/90 text-black">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="p-5">
                            <div className="font-semibold line-clamp-2">{item.title}</div>
                            <div className="text-xs text-zinc-500 mt-3 flex justify-between">
                              <span>{item.platform}</span>
                              <span>{item.publishDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Campaign Status Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Campaign Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="text-sm text-zinc-500">Current Theme</div>
                      <div className="font-semibold mt-1">Summer Growth 2026</div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-zinc-500 mb-3">Active Platforms</div>
                      <div className="flex gap-2">
                        {['Instagram', 'LinkedIn', 'Facebook'].map(p => (
                          <Badge key={p} variant="outline">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-5 text-sm">
                        <div className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <div>
                            <p><span className="font-medium">Summer Reel</span> was approved</p>
                            <p className="text-xs text-zinc-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <MessageCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <p>You left feedback on <span className="font-medium">Testimonial Carousel</span></p>
                            <p className="text-xs text-zinc-500">Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Approved Content</h2>
              <div className="relative w-80">
                <Input 
                  placeholder="Search content..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer" onClick={() => setSelectedContent(item)}>
                  <div className="aspect-video relative">
                    <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3">{item.platform} • {item.type}</Badge>
                    <h3 className="font-semibold leading-tight mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-zinc-600 line-clamp-3">{item.caption}</p>
                    <div className="text-xs text-zinc-500 mt-6">{item.publishDate}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === "approvals" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Items Awaiting Your Review</h2>
            {pendingApprovals.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingApprovals.map(item => (
                  <Card key={item.id} className="p-6" onClick={() => setSelectedContent(item)}>
                    <div className="flex gap-5">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} className="object-cover w-full h-full" alt="" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="destructive" className="mb-3">Pending Approval</Badge>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-zinc-600 mt-2 line-clamp-3">{item.caption}</p>
                        <Button 
                          className="mt-6 w-full" 
                          style={{ backgroundColor: brandColor }}
                          onClick={(e) => { e.stopPropagation(); alert("Opening approval modal..."); }}
                        >
                          Review &amp; Approve
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-emerald-600" />
                <h3 className="text-2xl font-semibold mt-6">All caught up!</h3>
                <p className="text-zinc-500 mt-2">No pending approvals at the moment.</p>
              </Card>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview • May 2026</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="natural" dataKey="reach" stroke={brandColor} strokeWidth={4} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Platform Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value">
                        {platformBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Top Performing Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {mockApprovedContent.filter(c => c.engagement).sort((a,b) => (b.engagement || 0) - (a.engagement || 0)).map((post, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-zinc-500">{post.platform}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-700">{post.engagement}%</div>
                        <div className="text-xs">ER</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Content Preview Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContent.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 rounded-3xl overflow-hidden border">
                <img src={selectedContent.image} alt="" className="w-full" />
              </div>
              <div className="mt-6">
                <p className="text-zinc-600 leading-relaxed">{selectedContent.caption}</p>
              </div>
              <div className="flex gap-4 mt-8 text-sm">
                <div>
                  <div className="text-zinc-500">Platform</div>
                  <div className="font-medium">{selectedContent.platform}</div>
                </div>
                <div>
                  <div className="text-zinc-500">Scheduled</div>
                  <div className="font-medium">{selectedContent.publishDate}</div>
                </div>
                {selectedContent.engagement && (
                  <div>
                    <div className="text-zinc-500">Engagement</div>
                    <div className="font-medium text-emerald-600">{selectedContent.engagement}%</div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}