'use client';

import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: { name: string; email: string; role: string; password: string }) => void;
  brandColor?: string;
}

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full workspace access' },
  { value: 'marketing_lead', label: 'Marketing Lead', description: 'Manage campaigns and content' },
  { value: 'creative_director', label: 'Creative Director', description: 'Oversee creative assets' },
  { value: 'client_view', label: 'Client View', description: 'View-only access' },
];

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  onAdd,
  brandColor = '#430062' 
}: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onAdd(formData);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', role: '', password: '' });
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', role: '', password: '' });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <UserPlus className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Add Team Member</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Invite someone to your workspace</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="name"
                placeholder="e.g. Sarah Chen"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`pl-10 rounded-2xl h-11 ${errors.name ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="sarah@company.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`pl-10 rounded-2xl h-11 ${errors.email ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-zinc-700">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, role: value }));
                if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
              }}
            >
              <SelectTrigger 
                id="role"
                className={`rounded-2xl p-4 py-6 h-11 ${errors.role ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="Select a role" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-1">
                {roles.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    className="rounded-xl cursor-pointer"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-medium">{role.label}</span>
                      <span className="text-xs text-zinc-500">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-500 ml-1">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Temporary Password
              </Label>
              <button
                type="button"
                onClick={() => {
                  const generated = Math.random().toString(36).slice(-12) + 'A1!';
                  setFormData(prev => ({ ...prev, password: generated }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className="text-xs font-medium hover:underline"
                style={{ color: brandColor }}
              >
                Generate
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`pr-10 rounded-2xl h-11 ${errors.password ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500 ml-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-zinc-400 ml-1">
                They&apos;ll be asked to change this on first login.
              </p>
            )}
          </div>

          {/* Live Preview */}
          {formData.name && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: brandColor }}
                >
                  {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900 truncate">{formData.name || 'New Member'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-500 truncate">{formData.email}</span>
                    {formData.role && (
                      <>
                        <span className="text-zinc-300">•</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {roles.find(r => r.value === formData.role)?.label}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator className="my-2" />

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-2xl font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.985] disabled:opacity-70"
              style={{ 
                backgroundColor: brandColor,
                boxShadow: `0 4px 14px ${brandColor}25`
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}