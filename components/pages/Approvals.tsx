'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const brandColor = "#430062";

// ==================== TYPES ====================
interface ApprovalItem {
  id: string;
  title: string;
  caption: string;
  platform: string;
  contentType: string;
  client: string;
  thumbnail: string;
  status: 'pending' | 'revision' | 'approved';
  dueDate: string;
  submittedAt: string;
  revisionCount: number;
}

interface Comment {
  id: string;
  user: string;
  role: string;
  comment: string;
  timestamp: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
}

// ==================== MOCK DATA ====================
const approvals: ApprovalItem[] = [
  {
    id: "app1",
    title: "Summer Collection Launch Reel",
    caption: "Get ready for our boldest summer drop yet. Shop the new arrivals now.",
    platform: "Instagram",
    contentType: "Reel",
    client: "Lumina Fashion",
    thumbnail: "https://picsum.photos/id/1015/600/400",
    status: "pending",
    dueDate: "May 24, 2026",
    submittedAt: "2 days ago",
    revisionCount: 1,
  },
  {
    id: "app2",
    title: "Q2 Performance Report Carousel",
    caption: "Real results from real campaigns. See how we helped Nexus grow.",
    platform: "LinkedIn",
    contentType: "Carousel",
    client: "Nexus Tech",
    thumbnail: "https://picsum.photos/id/201/600/400",
    status: "revision",
    dueDate: "May 23, 2026",
    submittedAt: "Yesterday",
    revisionCount: 2,
  },
  {
    id: "app3",
    title: "Mindful Monday Tip Graphic",
    caption: "One small change can transform your week.",
    platform: "Instagram",
    contentType: "Static",
    client: "Bloom Wellness",
    thumbnail: "https://picsum.photos/id/237/600/400",
    status: "approved",
    dueDate: "May 20, 2026",
    submittedAt: "3 days ago",
    revisionCount: 0,
  },
];

const mockComments: Comment[] = [
  { id: "c1", user: "Elena Voss", role: "Client", comment: "I love the visuals but can we make the CTA button larger?", timestamp: "4 hours ago" },
  { id: "c2", user: "Sarah Chen", role: "Marketing", comment: "Updated the button size and contrast. Ready for review.", timestamp: "2 hours ago" },
];

const mockHistory: HistoryEntry[] = [
  { id: "h1", action: "Submitted for Approval", user: "Sarah Chen", timestamp: "May 18, 2026" },
  { id: "h2", action: "Revision Requested", user: "Elena Voss", timestamp: "May 19, 2026", comment: "Make CTA button more prominent" },
  { id: "h3", action: "Resubmitted", user: "Sarah Chen", timestamp: "May 20, 2026" },
];

export default function ApprovalsModule() {
  const [activeTab, setActiveTab] = useState<"pending" | "revision" | "approved">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const filteredApprovals = approvals.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = clientFilter === "all" || item.client === clientFilter;
    const matchesTab = item.status === activeTab;
    return matchesSearch && matchesClient && matchesTab;
  });

  const openDetail = (approval: ApprovalItem) => {
    setSelectedApproval(approval);
    setIsDetailOpen(true);
  };

  const handleApprove = () => {
    alert("Content approved successfully! 🎉");
    setIsDetailOpen(false);
  };

  const handleRequestRevision = () => {
    alert("Revision request sent to team.");
    setIsDetailOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Approvals</h1>
          <p className="text-zinc-600 mt-1">Client collaboration hub</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input 
              placeholder="Search approvals..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="All Clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="Lumina Fashion">Lumina Fashion</SelectItem>
              <SelectItem value="Nexus Tech">Nexus Tech</SelectItem>
              <SelectItem value="Bloom Wellness">Bloom Wellness</SelectItem>
            </SelectContent>
          </Select>

          <Button style={{ backgroundColor: brandColor }} className="text-white">
            <Plus className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-semibold tracking-tighter">7</div>
            <p className="text-sm text-zinc-500 mt-2">Due this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Revision Needed</CardTitle>
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-semibold tracking-tighter">3</div>
            <p className="text-sm text-zinc-500 mt-2">Action required</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-zinc-200 rounded-3xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Approved This Month</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-semibold tracking-tighter">24</div>
            <p className="text-sm text-emerald-600 mt-2">+4 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="mb-8 bg-white border border-zinc-200">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Review
          </TabsTrigger>
          <TabsTrigger value="revision" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Needs Revision
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved
          </TabsTrigger>
        </TabsList>

        {["pending", "revision", "approved"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            {filteredApprovals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApprovals.map((item) => (
                  <Card 
                    key={item.id} 
                    className="bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => openDetail(item)}
                  >
                    <div className="relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge 
                          className={
                            item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            item.status === 'revision' ? 'bg-rose-100 text-rose-700' :
                            'bg-emerald-100 text-emerald-700'
                          }
                        >
                          {item.status === 'pending' ? 'Pending' : 
                           item.status === 'revision' ? 'Revision' : 'Approved'}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                        {item.title}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
                        <span>{item.platform}</span>
                        <span>•</span>
                        <span>{item.contentType}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-zinc-100 text-xs">
                              {item.client.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{item.client}</p>
                            <p className="text-xs text-zinc-500">Due {item.dueDate}</p>
                          </div>
                        </div>

                        {item.revisionCount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {item.revisionCount} revisions
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-medium">No approvals here</h3>
                <p className="text-zinc-500 mt-2">Everything is up to date.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Content Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-3xl p-0 flex flex-col">
          {selectedApproval && (
            <>
              <div className="p-8 border-b">
                <SheetHeader>
                  <SheetTitle className="text-2xl">{selectedApproval.title}</SheetTitle>
                  <div className="flex gap-3 mt-3">
                    <Badge>{selectedApproval.platform}</Badge>
                    <Badge variant="outline">{selectedApproval.contentType}</Badge>
                  </div>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-auto p-8">
                <img 
                  src={selectedApproval.thumbnail} 
                  alt="preview" 
                  className="w-full rounded-2xl mb-8 shadow-sm" 
                />

                <div>
                  <h4 className="uppercase text-xs tracking-widest text-zinc-500 mb-2">CAPTION</h4>
                  <p className="text-zinc-700 leading-relaxed text-lg">{selectedApproval.caption}</p>
                </div>

                <Separator className="my-10" />

                {/* Revision History */}
                <div className="mb-10">
                  <h4 className="font-semibold mb-4">Revision History</h4>
                  <div className="space-y-6 pl-4 border-l-2 border-zinc-200">
                    {mockHistory.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        {index !== mockHistory.length - 1 && (
                          <div className="absolute left-[-9px] top-6 w-0.5 h-6 bg-zinc-200" />
                        )}
                        <div className="flex gap-4">
                          <div className="text-xs w-20 text-right text-zinc-400 font-mono pt-0.5">
                            {entry.timestamp}
                          </div>
                          <div>
                            <div className="font-medium">{entry.action}</div>
                            <div className="text-sm text-zinc-500">by {entry.user}</div>
                            {entry.comment && (
                              <p className="text-sm text-zinc-600 mt-2 italic">"{entry.comment}"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    Comments <span className="text-xs px-2 py-0.5 bg-zinc-100 rounded-full">{mockComments.length}</span>
                  </h4>
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-6">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{comment.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{comment.user}</span>
                              <span className="text-xs text-zinc-400">{comment.timestamp}</span>
                            </div>
                            <p className="mt-1 text-zinc-600">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Sticky Action Bar */}
              <div className="border-t p-6 bg-white sticky bottom-0">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleRequestRevision}
                  >
                    Request Revision
                  </Button>
                  <Button 
                    className="flex-1 text-white"
                    style={{ backgroundColor: brandColor }}
                    onClick={handleApprove}
                  >
                    Approve Content
                  </Button>
                </div>
                <div className="mt-4">
                  <Textarea 
                    placeholder="Add a comment or note..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}