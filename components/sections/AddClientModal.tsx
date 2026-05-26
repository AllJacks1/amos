"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Building2,
  Mail,
  User,
  Briefcase,
  ImagePlus,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: {
    name: string;
    companyName: string;
    industry: string;
    logoPreview: string | null;
    logoFile: File | null;
    email: string;
    password: string;
  }) => Promise<void>;
  brandColor?: string;
}

const industries = [
  { value: "beauty_cosmetics", label: "Beauty & Cosmetics" },
  { value: "saas_technology", label: "SaaS Technology" },
  { value: "fashion_retail", label: "Fashion & Retail" },
  { value: "food_beverage", label: "Food & Beverage" },
  { value: "health_wellness", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Banking" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "real_estate", label: "Real Estate" },
  { value: "automotive", label: "Automotive" },
];

export default function AddClientModal({
  isOpen,
  onClose,
  onAdd,
  brandColor = "#430062",
}: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    industry: "",
    logoPreview: null as string | null,
    logoFile: null as File | null,
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Contact name is required";
    if (!formData.logoFile) {
      newErrors.logo = "Company logo is required";
    }
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      await onAdd(formData);

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      companyName: "",
      industry: "",
      logoPreview: null,
      logoFile: null,
      email: "",
      password: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logo: "Please upload an image file",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: "Image must be under 5MB",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logoPreview: reader.result as string,
        logoFile: file,
      }));

      setErrors((prev) => ({
        ...prev,
        logo: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoPreview: null,
      logoFile: null,
    }));
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
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Building2 className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Add New Client
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Create a new client workspace
                </p>
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

        {/* Form - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6"
        >
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-700">
              Company Logo
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`
                relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer
                ${isDragging ? "border-violet-400 bg-violet-50" : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"}
                ${formData.logoPreview ? "bg-white border-solid border-zinc-200" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />

              {formData.logoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={formData.logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLogo();
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900">
                      Logo uploaded
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Click to replace
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${brandColor}10` }}
                  >
                    <ImagePlus
                      className="h-5 w-5"
                      style={{ color: brandColor }}
                    />
                  </div>
                  <p className="text-sm font-medium text-zinc-700">
                    Drop logo here or{" "}
                    <span className="text-violet-600">click to browse</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
            {errors.logo && (
              <p className="text-xs text-red-500 ml-1">{errors.logo}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label
              htmlFor="companyName"
              className="text-sm font-medium text-zinc-700"
            >
              Company Name
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="companyName"
                placeholder="e.g. Velora Beauty"
                value={formData.companyName}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }));
                  if (errors.companyName)
                    setErrors((prev) => ({ ...prev, companyName: "" }));
                }}
                className={`pl-10 rounded-2xl h-11 ${errors.companyName ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              />
            </div>
            {errors.companyName && (
              <p className="text-xs text-red-500 ml-1">{errors.companyName}</p>
            )}
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label
              htmlFor="industry"
              className="text-sm font-medium text-zinc-700"
            >
              Industry
            </Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, industry: value }));
                if (errors.industry)
                  setErrors((prev) => ({ ...prev, industry: "" }));
              }}
            >
              <SelectTrigger
                id="industry"
                className={`rounded-2xl h-11 ${errors.industry ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-zinc-400" />
                  <SelectValue placeholder="Select industry" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl max-h-[280px] p-1">
                {industries.map((industry) => (
                  <SelectItem
                    key={industry.value}
                    value={industry.value}
                    className="rounded-xl cursor-pointer"
                  >
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-red-500 ml-1">{errors.industry}</p>
            )}
          </div>

          <Separator className="my-2" />

          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Primary Contact Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="name"
                placeholder="e.g. Rachel Green"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={`pl-10 rounded-2xl h-11 ${errors.name ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 ml-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`pl-10 rounded-2xl h-11 ${errors.email ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-700"
              >
                Temporary Password
              </Label>
              <button
                type="button"
                onClick={() => {
                  const generated =
                    Math.random().toString(36).slice(-12) + "A1!";
                  setFormData((prev) => ({ ...prev, password: generated }));
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
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
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`pr-10 rounded-2xl h-11 ${errors.password ? "border-red-300 focus-visible:ring-red-200" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500 ml-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-zinc-400 ml-1">
                They&apos;ll be prompted to change this on first login.
              </p>
            )}
          </div>

          {/* Live Preview Card */}
          {(formData.companyName || formData.name) && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Preview
              </p>
              <div className="flex items-center gap-3">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: brandColor }}
                  >
                    {formData.companyName?.slice(0, 2).toUpperCase() || "CL"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900 truncate">
                    {formData.companyName || "New Client"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {formData.industry && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {
                          industries.find((i) => i.value === formData.industry)
                            ?.label
                        }
                      </Badge>
                    )}
                    {formData.name && (
                      <span className="text-xs text-zinc-500">
                        {formData.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="border-t bg-white p-6 sm:p-8 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
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
                boxShadow: `0 4px 14px ${brandColor}25`,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Client...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Create Client
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
