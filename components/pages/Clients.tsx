"use client";

import React, { useState, useEffect } from "react";
import { useClientStore } from "@/store/clientStore";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  TrendingUp,
  Calendar,
  Building2,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AddClientModal from "../sections/AddClientModal";

// Types
interface Client {
  id: string;
  primary_contact_name: string;
  company_name: string;
  company_logo: string;
  industry: string;
  brandColor: string;
  activeCampaigns: number;
  status: "active" | "onboarding" | "paused";
  createdAt: string;
  monthlyReach: string;
  engagementRate: number;
  teamMembers: number;
  email?: string;
}

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const { clients, loading, fetchClients, addClient } = useClientStore();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "active")
      return (
        <Badge className="bg-emerald-100 text-emerald-700 rounded-full">
          Active
        </Badge>
      );
    if (status === "onboarding")
      return (
        <Badge className="bg-amber-100 text-amber-700 rounded-full">
          Onboarding
        </Badge>
      );
    return (
      <Badge variant="secondary" className="rounded-full">
        Paused
      </Badge>
    );
  };

  const handleUpdatePassword = async () => {
    if (!selectedClient) return;

    if (!newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsUpdatingPassword(true);

      const res = await fetch("/api/accounts/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedClient.id,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update password");
        return;
      }

      alert("Password updated successfully");

      // clear fields
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-8 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Clients
            </h1>
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

            <Button
              onClick={() => setIsAddClientOpen(true)}
              className="rounded-2xl bg-[#430062] hover:bg-[#430062]/90"
            >
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
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  {/* <TableHead>Monthly Reach</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Team</TableHead> */}
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
                          <AvatarImage src={client.company_logo} />
                          <AvatarFallback>
                            {client.primary_contact_name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">
                            {client.primary_contact_name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Since {client.createdAt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client.company_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-zinc-600">
                        {client.industry}
                      </div>
                    </TableCell>
                    {/* <TableCell>
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
                    </TableCell> */}
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
      <Dialog
        open={!!selectedClient}
        onOpenChange={() => setSelectedClient(null)}
      >
        <DialogContent className="w-[95vw] max-w-none sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-0 overflow-hidden rounded-2xl sm:rounded-3xl">
          {selectedClient && (
            <div className="flex flex-col h-[90vh] sm:h-auto sm:max-h-[85vh]">
              {/* Header */}
              <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
                  <Avatar className=" h-14 w-14 sm:h-16 sm:w-16 border-4 border-white shadow-md mx-auto sm:mx-0">
                    <AvatarImage src={selectedClient.company_logo} />
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {selectedClient.company_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight break-words">
                      {selectedClient.company_name}
                    </DialogTitle>

                    <p className="text-sm sm:text-base text-zinc-500 mt-1">
                      {selectedClient.industry}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Tabs */}
              <Tabs
                defaultValue="profile"
                className="flex flex-col flex-1 overflow-hidden"
              >
                {/* Tab List */}
                <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                  <TabsList
                    className="
                grid
                grid-cols-2
                w-full
                rounded-2xl
                bg-zinc-100
                p-1
              "
                  >
                    <TabsTrigger
                      value="profile"
                      className="
                  rounded-xl
                  text-sm
                  sm:text-base
                  font-medium
                "
                    >
                      Profile
                    </TabsTrigger>

                    <TabsTrigger
                      value="account"
                      className="
                  rounded-xl
                  text-sm
                  sm:text-base
                  font-medium
                "
                    >
                      Account
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Profile Tab */}
                <TabsContent
                  value="profile"
                  className="
              flex-1
              overflow-y-auto
              px-4
              sm:px-6
              py-5
              sm:py-6
              space-y-8
            "
                >
                  <div className="space-y-6">
                    <div>
                      <h4
                        className="
                    text-xs
                    font-semibold
                    tracking-widest
                    text-zinc-500
                    mb-4
                  "
                      >
                        COMPANY INFORMATION
                      </h4>

                      <div
                        className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                    sm:gap-6
                  "
                      >
                        <div className="min-w-0">
                          <p className="text-xs text-zinc-500">Company Name</p>

                          <p
                            className="
                        font-medium
                        mt-1
                        text-sm
                        sm:text-base
                        break-words
                      "
                          >
                            {selectedClient.company_name}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-zinc-500">Industry</p>

                          <p
                            className="
                        font-medium
                        mt-1
                        text-sm
                        sm:text-base
                        break-words
                      "
                          >
                            {selectedClient.industry}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500">Status</p>

                          <div className="mt-1">
                            {getStatusBadge(selectedClient.status)}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500">Member Since</p>

                          <p className="font-medium mt-1 text-sm sm:text-base">
                            {selectedClient.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent
                  value="account"
                  className="
              flex-1
              overflow-y-auto
              px-4
              sm:px-6
              py-5
              sm:py-6
            "
                >
                  <Card className="rounded-2xl sm:rounded-3xl">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle className="text-lg sm:text-xl">
                        Account Details
                      </CardTitle>

                      <CardDescription className="text-sm">
                        Manage login credentials and contact information
                      </CardDescription>
                    </CardHeader>

                    <CardContent
                      className="
                  px-4
                  sm:px-6
                  space-y-6
                  sm:space-y-8
                "
                    >
                      {/* Email */}
                      <div>
                        <label className="text-sm text-zinc-500 block mb-2">
                          Email Address
                        </label>

                        <Input
                          value={selectedClient.email || "admin@company.com"}
                          className="rounded-2xl h-11"
                          disabled
                        />

                        <p className="text-xs text-zinc-400 mt-1.5">
                          Contact support to change email
                        </p>
                      </div>

                      <Separator />

                      {/* Change Password */}
                      <div>
                        <h4 className="font-medium mb-4">Change Password</h4>

                        <div className="space-y-5">
                          <div>
                            <label className="text-sm text-zinc-500 block mb-1.5">
                              New Password
                            </label>

                            <Input
                              type="password"
                              placeholder="Enter new password"
                              className="rounded-2xl h-11"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="text-sm text-zinc-500 block mb-1.5">
                              Confirm New Password
                            </label>

                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              className="rounded-2xl h-11"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>

                          <Button
                            onClick={handleUpdatePassword}
                            disabled={isUpdatingPassword}
                            className="
    w-full
    h-11
    sm:h-12
    rounded-2xl
    text-sm
    sm:text-base
    font-medium
  "
                          >
                            {isUpdatingPassword
                              ? "Updating..."
                              : "Update Password"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="border-t p-4 sm:p-6 flex justify-center sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(null)}
                  className="w-full sm:w-auto rounded-2xl px-8 h-11"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAdd={async (client) => {
          try {
            const formData = new FormData();

            formData.append("company_name", client.company_name);
            formData.append("industry", client.industry);
            formData.append(
              "primary_contact_name",
              client.primary_contact_name,
            );
            formData.append("email", client.email);
            formData.append("password", client.password);

            // upload file
            if (client.logoFile) {
              formData.append("company_logo", client.logoFile);
            }

            const res = await fetch("/api/auth/register-client", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.error || "Failed to create client");
              return;
            }

            // your API returns an ARRAY because of insert([...]).select()
            const createdClient = data.client[0];

            addClient({
              id: createdClient.id,
              created_at: createdClient.created_at,
              company_logo: createdClient.company_logo,
              company_name: createdClient.company_name,
              industry: createdClient.industry,
              primary_contact_name: createdClient.primary_contact_name,
              email: createdClient.email,
              status: createdClient.status,
              first_login: createdClient.first_login,
            });

            setIsAddClientOpen(false);
          } catch (err) {
            console.error(err);
            alert("Something went wrong");
          }
        }}
      />
    </div>
  );
}
