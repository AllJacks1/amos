'use client';

import React, { useState } from 'react';
import { 
  X, Plus, FileText, Calendar, User, Building2, Link2, Tag, 
  LayoutGrid, Image, Video, FileImage, Type, Loader2, Check,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: {
    title: string;
    caption: string;
    platform: string;
    contentType: string;
    publishDate: string;
    client: string;
    assignedTo: string;
    driveLinks: string[];
    pillar: string;
    status: string;
  }) => void;
  brandColor?: string;
}

const platforms = [
  { value: 'Instagram', label: 'Instagram', icon: Globe, color: '#E4405F' },
  { value: 'LinkedIn', label: 'LinkedIn', icon: Globe, color: '#0A66C2' },
  { value: 'Facebook', label: 'Facebook', icon: Globe, color: '#1877F2' },
  { value: 'Twitter', label: 'Twitter / X', icon: Globe, color: '#000000' },
  { value: 'TikTok', label: 'TikTok', icon: Video, color: '#000000' },
  { value: 'YouTube', label: 'YouTube', icon: Video, color: '#FF0000' },
];

const contentTypes = [
  { value: 'Reel', label: 'Reel', icon: Video },
  { value: 'Carousel', label: 'Carousel', icon: LayoutGrid },
  { value: 'Static', label: 'Static Post', icon: Image },
  { value: 'Story', label: 'Story', icon: FileImage },
  { value: 'Text', label: 'Text Post', icon: Type },
  { value: 'Video', label: 'Video', icon: Video },
];

const pillars = [
  'Product Launch', 'Thought Leadership', 'Educational',
  'Behind the Scenes', 'User Generated', 'Promotional',
  'Seasonal', 'Community',
];

const clients = ['Lumina Fashion', 'Nexus Tech', 'Bloom Wellness', 'Velora Beauty', 'Acme Retail'];
const teamMembers = ['Sarah Chen', 'Marcus Rivera', 'Aisha Patel', 'David Kim', 'Priya Sharma'];

export default function AddContentModal({ 
  isOpen, 
  onClose, 
  onAdd,
  brandColor = '#430062' 
}: AddContentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    platform: '',
    contentType: '',
    publishDate: '',
    client: '',
    assignedTo: '',
    driveLinks: [''] as string[],
    pillar: '',
    status: 'draft' as string,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.contentType) newErrors.contentType = 'Content type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.client) newErrors.client = 'Client is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assignee is required';
    if (!formData.pillar) newErrors.pillar = 'Content pillar is required';
    if (!formData.publishDate) newErrors.publishDate = 'Publish date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }
    if (!validateStep2()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const cleanLinks = formData.driveLinks.filter(link => link.trim() !== '');
    onAdd({ ...formData, driveLinks: cleanLinks.length > 0 ? cleanLinks : [] });
    
    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '', caption: '', platform: '', contentType: '',
      publishDate: '', client: '', assignedTo: '',
      driveLinks: [''], pillar: '', status: 'draft',
    });
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const addDriveLink = () => {
    setFormData(prev => ({ ...prev, driveLinks: [...prev.driveLinks, ''] }));
  };

  const removeDriveLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      driveLinks: prev.driveLinks.filter((_, i) => i !== index),
    }));
  };

  const updateDriveLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      driveLinks: prev.driveLinks.map((link, i) => (i === index ? value : link)),
    }));
  };

  if (!isOpen) return null;

  const selectedPlatform = platforms.find(p => p.value === formData.platform);
  const selectedType = contentTypes.find(t => t.value === formData.contentType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <FileText className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {step === 1 ? 'New Content' : 'Details & Assignment'}
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">Step {step} of 2</p>
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

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            <div 
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: step >= 1 ? brandColor : '#e4e4e7' }}
            />
            <div 
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: step >= 2 ? brandColor : '#e4e4e7' }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          
          {step === 1 ? (
            <>
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-zinc-700">
                  Content Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Summer Collection Launch Reel"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`rounded-2xl h-11 ${errors.title ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 ml-1">{errors.title}</p>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption" className="text-sm font-medium text-zinc-700">
                  Caption
                </Label>
                <Textarea
                  id="caption"
                  placeholder="Write your caption here..."
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  className="rounded-2xl min-h-[100px] resize-none"
                />
                <p className="text-xs text-zinc-400 text-right">
                  {formData.caption.length} chars
                </p>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Platform</Label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = formData.platform === platform.value;
                    return (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, platform: platform.value }));
                          if (errors.platform) setErrors(prev => ({ ...prev, platform: '' }));
                        }}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 relative
                          ${isSelected 
                            ? 'border-violet-500 bg-violet-50 text-violet-700' 
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" style={{ color: isSelected ? brandColor : undefined }} />
                        <span className="text-xs font-medium">{platform.label}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-violet-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.platform && (
                  <p className="text-xs text-red-500 ml-1">{errors.platform}</p>
                )}
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Content Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.contentType === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, contentType: type.value }));
                          if (errors.contentType) setErrors(prev => ({ ...prev, contentType: '' }));
                        }}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 relative
                          ${isSelected 
                            ? 'border-violet-500 bg-violet-50 text-violet-700' 
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-violet-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.contentType && (
                  <p className="text-xs text-red-500 ml-1">{errors.contentType}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Client */}
              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium text-zinc-700">Client</Label>
                <Select
                  value={formData.client}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, client: value }));
                    if (errors.client) setErrors(prev => ({ ...prev, client: '' }));
                  }}
                >
                  <SelectTrigger 
                    id="client"
                    className={`rounded-2xl h-11 ${errors.client ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select client" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {clients.map((client) => (
                      <SelectItem key={client} value={client} className="rounded-xl cursor-pointer">
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client && (
                  <p className="text-xs text-red-500 ml-1">{errors.client}</p>
                )}
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-sm font-medium text-zinc-700">Assigned To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, assignedTo: value }));
                    if (errors.assignedTo) setErrors(prev => ({ ...prev, assignedTo: '' }));
                  }}
                >
                  <SelectTrigger 
                    id="assignedTo"
                    className={`rounded-2xl h-11 ${errors.assignedTo ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select team member" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member} className="rounded-xl cursor-pointer">
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedTo && (
                  <p className="text-xs text-red-500 ml-1">{errors.assignedTo}</p>
                )}
              </div>

              {/* Pillar */}
              <div className="space-y-2">
                <Label htmlFor="pillar" className="text-sm font-medium text-zinc-700">Content Pillar</Label>
                <Select
                  value={formData.pillar}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, pillar: value }));
                    if (errors.pillar) setErrors(prev => ({ ...prev, pillar: '' }));
                  }}
                >
                  <SelectTrigger 
                    id="pillar"
                    className={`rounded-2xl h-11 ${errors.pillar ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-zinc-400" />
                      <SelectValue placeholder="Select pillar" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {pillars.map((pillar) => (
                      <SelectItem key={pillar} value={pillar} className="rounded-xl cursor-pointer">
                        {pillar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pillar && (
                  <p className="text-xs text-red-500 ml-1">{errors.pillar}</p>
                )}
              </div>

              {/* Publish Date */}
              <div className="space-y-2">
                <Label htmlFor="publishDate" className="text-sm font-medium text-zinc-700">Publish Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, publishDate: e.target.value }));
                      if (errors.publishDate) setErrors(prev => ({ ...prev, publishDate: '' }));
                    }}
                    className={`pl-10 rounded-2xl h-11 ${errors.publishDate ? 'border-red-300 focus-visible:ring-red-200' : ''}`}
                  />
                </div>
                {errors.publishDate && (
                  <p className="text-xs text-red-500 ml-1">{errors.publishDate}</p>
                )}
              </div>

              {/* Drive Links */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Google Drive Links</Label>
                <div className="space-y-2">
                  {formData.driveLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          placeholder="https://drive.google.com/..."
                          value={link}
                          onChange={(e) => updateDriveLink(index, e.target.value)}
                          className="pl-10 rounded-2xl h-11"
                        />
                      </div>
                      {formData.driveLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDriveLink(index)}
                          className="w-11 h-11 rounded-2xl border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDriveLink}
                  className="text-sm font-medium flex items-center gap-1.5 hover:underline"
                  style={{ color: brandColor }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another link
                </button>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Initial Status</Label>
                <div className="flex gap-2">
                  {['draft', 'review'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status }))}
                      className={`
                        flex-1 py-2.5 px-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 capitalize
                        ${formData.status === status
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Live Preview */}
          {(formData.title || formData.platform) && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Preview</p>
              <div className="flex items-start gap-3">
                {selectedPlatform && (
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${selectedPlatform.color}15` }}
                  >
                    <selectedPlatform.icon className="h-5 w-5" style={{ color: selectedPlatform.color }} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 truncate">{formData.title || 'Untitled Content'}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {formData.platform && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {formData.platform}
                      </Badge>
                    )}
                    {formData.contentType && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {formData.contentType}
                      </Badge>
                    )}
                    {formData.client && (
                      <span className="text-xs text-zinc-500">{formData.client}</span>
                    )}
                  </div>
                  {formData.caption && (
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{formData.caption}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t bg-white p-6 sm:p-8 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-11 rounded-2xl font-medium"
              >
                Back
              </Button>
            )}
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
              onClick={handleSubmit}
              className="w-full sm:flex-1 h-11 rounded-2xl font-semibold text-white shadow-lg transition-all active:scale-[0.985] disabled:opacity-70"
              style={{ 
                backgroundColor: brandColor,
                boxShadow: `0 4px 14px ${brandColor}25`
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : step === 1 ? (
                <>Next</>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}