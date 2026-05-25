'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, MoreHorizontal, Users, TrendingUp, Calendar, 
  Building2, Globe,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface Client {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  brandColor: string;
  activeCampaigns: number;
  status: 'active' | 'onboarding' | 'paused';
  createdAt: string;
  monthlyReach: string;
  engagementRate: number;
  teamMembers: number;
}

interface PlatformConnection {
  platform: string;
  accountName: string;
  status: 'connected' | 'error' | 'pending';
  lastSynced: string;
  icon: React.ReactNode;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
  lastActive: string;
  avatar: string;
}

// Mock Data
const clients: Client[] = [
  {
    id: "1",
    companyName: "Velora Beauty",
    logo: "https://picsum.photos/id/64/128/128",
    industry: "Beauty & Cosmetics",
    brandColor: "#c026d3",
    activeCampaigns: 6,
    status: "active",
    createdAt: "Mar 12, 2025",
    monthlyReach: "1.2M",
    engagementRate: 18.4,
    teamMembers: 4
  },
  {
    id: "2",
    companyName: "Nexus Dynamics",
    logo: "https://picsum.photos/id/201/128/128",
    industry: "SaaS Technology",
    brandColor: "#2563eb",
    activeCampaigns: 4,
    status: "active",
    createdAt: "Jan 08, 2025",
    monthlyReach: "892K",
    engagementRate: 12.7,
    teamMembers: 7
  },
  {
    id: "3",
    companyName: "Acme Retail",
    logo: "https://picsum.photos/id/106/128/128",
    industry: "Fashion & Retail",
    brandColor: "#ea580c",
    activeCampaigns: 3,
    status: "onboarding",
    createdAt: "May 01, 2026",
    monthlyReach: "245K",
    engagementRate: 9.8,
    teamMembers: 3
  },
];

const platformConnections: PlatformConnection[] = [
  { platform: "Instagram", accountName: "@velorabeauty", status: "connected", lastSynced: "2 hours ago", icon: <Globe className="h-5 w-5" /> },
  { platform: "Facebook", accountName: "Velora Beauty", status: "connected", lastSynced: "Yesterday", icon: <Globe className="h-5 w-5" /> },
  { platform: "LinkedIn", accountName: "Velora Beauty Co.", status: "connected", lastSynced: "3 days ago", icon: <Globe className="h-5 w-5" /> },
];

const teamMembers: TeamMember[] = [
  { name: "Sarah Chen", email: "sarah@velora.com", role: "Marketing Lead", lastActive: "Today", avatar: "https://picsum.photos/id/64/128/128" },
  { name: "Marcus Torres", email: "marcus@velora.com", role: "Content Creator", lastActive: "2 days ago", avatar: "https://picsum.photos/id/201/128/128" },
  { name: "Priya Sharma", email: "priya@velora.com", role: "Client Owner", lastActive: "Today", avatar: "https://picsum.photos/id/106/128/128" },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-emerald-100 text-emerald-700 rounded-full">Active</Badge>;
    if (status === 'onboarding') return <Badge className="bg-amber-100 text-amber-700 rounded-full">Onboarding</Badge>;
    return <Badge variant="secondary" className="rounded-full">Paused</Badge>;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Clients</h1>
            <p className="text-zinc-500 mt-1">Workspace & Account Management</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10 rounded-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 rounded-2xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Button className="rounded-2xl bg-[#430062] hover:bg-[#430062]/90">
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </div>
        </div>

        {/* Clients Table */}
        <Card className="rounded-3xl border border-zinc-100">
          <CardHeader>
            <CardTitle>All Clients ({filteredClients.length})</CardTitle>
            <CardDescription>Manage workspaces and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Active Campaigns</TableHead>
                  <TableHead>Monthly Reach</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead className="w-12"></TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="hover:bg-zinc-50 cursor-pointer group"
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={client.logo} />
                          <AvatarFallback>{client.companyName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{client.companyName}</div>
                          <div className="text-xs text-zinc-500">Since {client.createdAt}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-zinc-600">{client.industry}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-medium">{client.activeCampaigns}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client.monthlyReach}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        {client.engagementRate}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Users className="h-4 w-4" />
                        {client.teamMembers}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    {/* <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Quick Actions</SheetTitle>
                          </SheetHeader>
                          Quick actions content
                        </SheetContent>
                      </Sheet>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredClients.length === 0 && (
              <div className="text-center py-20 text-zinc-400">
                No clients found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Client Detail Sheet */}
      <Sheet open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        <SheetContent className="w-full max-w-3xl overflow-auto">
          {selectedClient && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow">
                    <AvatarImage src={selectedClient.logo} />
                  </Avatar>
                  <div>
                    <SheetTitle className="text-3xl">{selectedClient.companyName}</SheetTitle>
                    <p className="text-zinc-500">{selectedClient.industry}</p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-4 rounded-2xl">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="platforms">Platforms</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-8 mt-8">
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Snapshot</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Monthly Reach</span>
                          <span className="font-semibold text-xl">{selectedClient.monthlyReach}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Engagement Rate</span>
                          <span className="font-semibold text-xl text-emerald-600">{selectedClient.engagementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Active Campaigns</span>
                          <span className="font-semibold text-xl">{selectedClient.activeCampaigns}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Workspace Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Status</span>
                            {getStatusBadge(selectedClient.status)}
                          </div>
                          <div className="flex justify-between">
                            <span>Created</span>
                            <span>{selectedClient.createdAt}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="mt-8">
                  <Card className="rounded-3xl">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Team Access</CardTitle>
                        <Button variant="outline" className="rounded-2xl">Invite Member</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={member.avatar} />
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-zinc-500">{member.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">{member.role}</Badge>
                              <span className="text-xs text-zinc-400">{member.lastActive}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Platforms Tab */}
                <TabsContent value="platforms" className="mt-8">
                  <Card className="rounded-3xl">
                    <CardHeader>
                      <CardTitle>Connected Platforms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {platformConnections.map((conn, i) => (
                          <div key={i} className="flex items-center justify-between p-5 border rounded-3xl">
                            <div className="flex items-center gap-4">
                              {conn.icon}
                              <div>
                                <div className="font-medium">{conn.platform}</div>
                                <div className="text-sm text-zinc-500">{conn.accountName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="mb-1" variant={conn.status === 'connected' ? 'default' : 'destructive'}>
                                {conn.status}
                              </Badge>
                              <div className="text-xs text-zinc-400">Synced {conn.lastSynced}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-8">
                  <Card className="rounded-3xl">
                    <CardHeader>
                      <CardTitle>Workspace Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div>
                        <label className="text-sm text-zinc-500 block mb-2">Brand Color</label>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl" style={{ backgroundColor: selectedClient.brandColor }} />
                          <Input value={selectedClient.brandColor} className="w-40 rounded-2xl" />
                        </div>
                      </div>

                      <Separator />

                      <Button variant="outline" className="w-full rounded-2xl h-12 border-red-200 text-red-600 hover:bg-red-50">
                        Archive Workspace
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}