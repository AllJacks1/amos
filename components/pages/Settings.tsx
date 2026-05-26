"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Palette,
  Bell,
  Plug,
  Shield,
  Save,
  Plus,
  Trash2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsersStore } from "@/store/useUsersStore";
import AddMemberModal from "../sections/AddMemberModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "deactivated";
  lastActive: string;
  avatar: string;
}

const sidebarItems = [
  // { id: 'workspace', label: 'Workspace', icon: Settings },
  { id: "users", label: "Team Members", icon: Users },
  // { id: 'permissions', label: 'Permissions', icon: Shield },
  // { id: 'notifications', label: 'Notifications', icon: Bell },
  // { id: 'integrations', label: 'Integrations', icon: Plug },
  // { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState("users");
  const [workspaceName, setWorkspaceName] = useState("AMOS Agency");
  const [brandColor, setBrandColor] = useState("#430062");
  const [notificationSettings, setNotificationSettings] = useState({
    approvals: true,
    campaigns: true,
    mentions: true,
    weeklyReport: true,
  });

  const { users, fetchUsers, loading } = useUsersStore();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddMember = async (member: {
    name: string;
    email: string;
    role: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/auth/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: member.name,
          email: member.email,
          role: member.role,
          password: member.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create user");
        return;
      }

      fetchUsers({ force: true });

      alert("Member added successfully!");
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await fetch("/api/accounts/deactivate-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to deactivate user");
        return;
      }

      // Update local state
      fetchUsers({ force: true });

      alert("User deactivated successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-zinc-500 mt-1">
              Workspace configuration and administration
            </p>
          </div>
          {/* <Button
            onClick={handleSave}
            className="rounded-2xl bg-[#430062] hover:bg-[#430062]/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button> */}
        </div>

        <div className="flex gap-10">
          {/* Sticky Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                      activeTab === item.id
                        ? "bg-white shadow-sm text-[#430062] font-medium"
                        : "hover:bg-white/60 text-zinc-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            {/* Workspace Settings */}
            {activeTab === "workspace" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Workspace Information</CardTitle>
                  <CardDescription>
                    Manage your agency workspace details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <Label>Workspace Name</Label>
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="mt-2 rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label>Brand Color</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-zinc-200"
                      />
                      <Input
                        value={brandColor}
                        className="rounded-2xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Workspace Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-20 h-20 border-2 border-dashed border-zinc-300 rounded-3xl flex items-center justify-center bg-white">
                        <span className="text-xs text-zinc-400">LOGO</span>
                      </div>
                      <Button variant="outline" className="rounded-2xl">
                        Upload New Logo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Workspace URL</Label>
                    <div className="mt-2 flex">
                      <div className="bg-zinc-100 px-4 flex items-center rounded-l-2xl text-sm text-zinc-500">
                        amos.app/
                      </div>
                      <Input
                        className="rounded-l-none rounded-2xl"
                        defaultValue="agency"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Management */}
            {activeTab === "users" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Manage who has access to this workspace
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsAddMemberOpen(true)}
                      className="rounded-2xl"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        {/* <TableHead>Last Active</TableHead> */}
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.fullname
                                    ? user.fullname
                                        .trim()
                                        .split(/\s+/)
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                    : "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-zinc-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          {/* <TableCell className="text-sm text-zinc-500">{user.lastActive}</TableCell> */}
                          <TableCell>
                            <Badge
                              className={`rounded-full ${
                                user.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status === "active"
                                ? "Active"
                                : "Deactivated"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => handleDeactivateUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Permissions */}
            {activeTab === "permissions" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>
                    Control access to different modules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {["Admin", "Marketing Lead", "Creative", "Client View"].map(
                    (role, i) => (
                      <div key={i} className="p-6 border rounded-3xl">
                        <div className="font-semibold mb-4">{role}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span>Reports</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex justify-between">
                            <span>Analytics</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex justify-between">
                            <span>Clients</span>
                            <Switch defaultChecked={role !== "Client View"} />
                          </div>
                          <div className="flex justify-between">
                            <span>Campaigns</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex justify-between">
                            <span>Settings</span>
                            <Switch defaultChecked={role === "Admin"} />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.keys(notificationSettings).map((key) => (
                    <div
                      key={key}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="text-sm text-zinc-500">
                          Receive updates via email and in-app
                        </div>
                      </div>
                      <Switch
                        checked={
                          notificationSettings[
                            key as keyof typeof notificationSettings
                          ]
                        }
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [key]: checked,
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Integrations */}
            {activeTab === "integrations" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Connected Platforms</CardTitle>
                  <CardDescription>
                    Manage social media and third-party integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    "Instagram",
                    "Facebook",
                    "LinkedIn",
                    "Google Analytics",
                  ].map((platform, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-6 border rounded-3xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 rounded-2xl flex items-center justify-center">
                          {platform[0]}
                        </div>
                        <div>
                          <div className="font-medium">{platform}</div>
                          <div className="text-sm text-emerald-600">
                            Connected • Last synced 2h ago
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-2xl">
                        Reconnect
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how your workspace looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {["Light", "Dark", "System"].map((theme) => (
                        <div
                          key={theme}
                          className="border-2 border-[#430062] rounded-3xl p-6 text-center cursor-pointer"
                        >
                          {theme}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>UI Density</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger className="mt-2 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
        brandColor={brandColor}
      />
    </div>
  );
}
