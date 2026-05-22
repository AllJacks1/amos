'use client';

import React, { useState, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const brandColor = "#430062";

interface ApprovalItem {
  id: string;
  title: string;
  caption: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Google';
  type: 'Static' | 'Carousel' | 'Reel' | 'Story';
  status: 'For Approval' | 'Approved' | 'Revision Requested' | 'Resubmitted';
  scheduledDate: string;
  deadline: string;
  image: string;
  revisionCount: number;
  submittedDate: string;
  commentsCount: number;
  lastComment?: string;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: "AP-3941",
    title: "Summer Campaign Hero Reel",
    caption: "Get ready for the biggest drop of the season. Our new collection is here and it's better than ever.",
    platform: "Instagram",
    type: "Reel",
    status: "For Approval",
    scheduledDate: "2026-05-28",
    deadline: "2026-05-25",
    image: "https://picsum.photos/id/1015/800/600",
    revisionCount: 1,
    submittedDate: "2026-05-22",
    commentsCount: 2,
    lastComment: "Love the visuals but can we make the CTA stronger?"
  },
  {
    id: "AP-3942",
    title: "Client Testimonial Carousel",
    caption: "Real stories from real businesses. See how our platform helped these brands grow.",
    platform: "LinkedIn",
    type: "Carousel",
    status: "Revision Requested",
    scheduledDate: "2026-05-30",
    deadline: "2026-05-26",
    image: "https://picsum.photos/id/106/800/600",
    revisionCount: 2,
    submittedDate: "2026-05-21",
    commentsCount: 4
  },
  {
    id: "AP-3943",
    title: "Weekly Marketing Tip - Static Post",
    caption: "5 ways to improve your email open rates in 2026.",
    platform: "Facebook",
    type: "Static",
    status: "For Approval",
    scheduledDate: "2026-06-02",
    deadline: "2026-05-28",
    image: "https://picsum.photos/id/201/800/600",
    revisionCount: 0,
    submittedDate: "2026-05-23",
    commentsCount: 0
  },
];

const approvalHistory = [
  { action: "Submitted for Approval", by: "Marketing Team", time: "May 22, 10:45 AM", note: "" },
  { action: "Revision Requested", by: "John Rivera (Client)", time: "May 23, 2:15 PM", note: "Please adjust the tone to be more professional." },
  { action: "Resubmitted", by: "Sarah Chen", time: "May 23, 4:30 PM", note: "Updated based on feedback" },
];

const kpiData = [
  { title: "Pending Approvals", value: "7", change: "2 due today", icon: Clock, color: "text-amber-600" },
  { title: "Approved This Month", value: "19", change: "+4", icon: CheckCircle, color: "text-emerald-600" },
  { title: "Avg Approval Time", value: "1.8d", change: "-0.4d", icon: ArrowRight, color: "text-emerald-600" },
  { title: "Revision Rate", value: "23%", change: "-5%", icon: RefreshCw, color: "text-amber-600" },
];

const statusColors = {
  "For Approval": "bg-amber-100 text-amber-700 border-amber-200",
  "Approved": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Revision Requested": "bg-rose-100 text-rose-700 border-rose-200",
  "Resubmitted": "bg-purple-100 text-purple-700 border-purple-200",
};

export default function ClientContentApprovals() {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [comment, setComment] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return mockApprovals.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.caption.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleApprove = () => {
    alert("✅ Content Approved! The team has been notified.");
    setSelectedItem(null);
    setComment("");
  };

  const handleRevision = () => {
    if (!comment.trim()) {
      alert("Please provide feedback for revision.");
      return;
    }
    alert("🔄 Revision request sent to the creative team.");
    setSelectedItem(null);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: brandColor }}
            >
              A
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Content Approvals</h1>
              <p className="text-zinc-500">Review • Approve • Collaborate • Axis Marketing</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1.5">
              Client Portal • Acme Corp
            </Badge>
            <Button variant="outline" size="sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Deadline Calendar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 pb-6 border-t pt-4 flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Input 
              placeholder="Search content to review..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Items</SelectItem>
              <SelectItem value="For Approval">For Approval</SelectItem>
              <SelectItem value="Revision Requested">Revision Requested</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Resubmitted">Resubmitted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiData.map((kpi, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <CardTitle className="text-sm text-zinc-500 font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="w-5 h-5 text-zinc-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-semibold tracking-tighter">{kpi.value}</div>
                <p className={`text-sm mt-1 ${kpi.color}`}>{kpi.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Main Content - Approval Cards */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Items Awaiting Your Review</h2>
              <span className="text-sm text-zinc-500">{filteredItems.length} total</span>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative">
                      <div className="aspect-video relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className={statusColors[item.status]}>{item.status}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold leading-tight line-clamp-2">{item.title}</div>
                          <div className="text-xs text-zinc-500 mt-1">{item.platform} • {item.type}</div>
                        </div>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          Rev {item.revisionCount}
                        </Badge>
                      </div>

                      <p className="text-sm text-zinc-600 line-clamp-3 mb-6">{item.caption}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Clock className="w-3.5 h-3.5" />
                          Due {new Date(item.deadline).toLocaleDateString()}
                        </div>
                        {item.commentsCount > 0 && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {item.commentsCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-20 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold">All caught up!</h3>
                <p className="text-zinc-500 mt-2 max-w-sm mx-auto">No pending approvals at the moment. New content will appear here automatically.</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-96 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80 pr-4">
                  {approvalHistory.map((entry, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">JR</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium">{entry.by}</span> {entry.action.toLowerCase()}
                          </div>
                          {entry.note && (
                            <div className="text-sm text-zinc-600 mt-1.5 italic">“{entry.note}”</div>
                          )}
                          <div className="text-xs text-zinc-500 mt-2">{entry.time}</div>
                        </div>
                      </div>
                      {index < approvalHistory.length - 1 && <Separator className="my-6" />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Approaching Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockApprovals.filter(i => i.status !== "Approved").slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl">
                    <div className="text-right text-sm">
                      <div className="font-mono text-xs text-rose-600">DUE SOON</div>
                      <div>{new Date(item.deadline).toLocaleDateString([], {month:'short', day:'numeric'})}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-zinc-500">{item.platform}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Review Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => {setSelectedItem(null); setComment("");}}>
        <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0">
          {selectedItem && (
            <>
              <DialogHeader className="px-8 pt-8 pb-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-3 mt-2">
                      <Badge style={{ backgroundColor: '#43006220', color: brandColor }}>{selectedItem.platform}</Badge>
                      <Badge variant="secondary">{selectedItem.type}</Badge>
                      <span className="text-xs">ID: {selectedItem.id}</span>
                    </DialogDescription>
                  </div>
                  <Badge className={statusColors[selectedItem.status]}>{selectedItem.status}</Badge>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Preview */}
                  <div className="lg:col-span-3">
                    <div className="rounded-3xl overflow-hidden border shadow-sm mb-8">
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.title}
                        className="w-full aspect-video object-cover"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Caption</h4>
                      <p className="text-zinc-600 leading-relaxed">{selectedItem.caption}</p>
                    </div>
                  </div>

                  {/* Sidebar Info + Comments */}
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">DEADLINE</div>
                      <div className="text-lg font-medium">
                        {new Date(selectedItem.deadline).toLocaleDateString('en-US', { 
                          weekday: 'long', month: 'long', day: 'numeric' 
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Comments / Feedback */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Discussion</h4>
                        <Badge variant="outline">{selectedItem.commentsCount} comments</Badge>
                      </div>

                      <Textarea 
                        placeholder="Write your feedback or approval notes here..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[140px]"
                      />

                      <div className="mt-4 text-xs text-zinc-500">
                        Your comments will be visible to the creative team.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval History */}
                <div className="mt-12">
                  <h4 className="font-semibold mb-4">Approval History</h4>
                  <div className="space-y-5 border-l-2 border-zinc-200 pl-6">
                    {approvalHistory.map((entry, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-white shadow" 
                             style={{ backgroundColor: brandColor }} />
                        <div>
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-sm text-zinc-600">{entry.by}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{entry.time}</div>
                          {entry.note && <div className="mt-2 text-sm italic">“{entry.note}”</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Footer Actions */}
              <div className="border-t bg-white p-6 flex items-center gap-4 sticky bottom-0 rounded-b-2xl">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-base"
                  onClick={handleRevision}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Request Revision
                </Button>
                
                <Button 
                  onClick={handleApprove}
                  className="flex-1 h-12 text-base"
                  style={{ backgroundColor: brandColor }}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Approve Content
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}