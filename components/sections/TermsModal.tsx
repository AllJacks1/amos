"use client";

import React from "react";
import {
  FileText,
  Shield,
  Mail,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ────────────────────────────────
  CONFIG
──────────────────────────────── */
const BRAND_COLOR = "#430062";

/* ────────────────────────────────
  TERMS DATA
──────────────────────────────── */
type Section = {
  id: string;
  number: string;
  title: string;
  content: string[];
  list?: string[];
  footer?: string;
  contact?: {
    name: string;
    email: string;
  };
};

const sections: Section[] = [
  {
    id: "use",
    number: "1",
    title: "Use of the Platform",
    content: [
      "Axis Command is provided to help organizations manage marketing operations, content, campaigns, reporting, approvals, and related business activities.",
      "You agree to use the platform only for lawful business purposes and in accordance with these terms.",
    ],
  },
  {
    id: "accounts",
    number: "2",
    title: "User Accounts",
    content: [
      "Access to the platform requires an authorized account.",
      "You are responsible for:",
    ],
    list: [
      "Maintaining the confidentiality of your login credentials.",
      "Ensuring information associated with your account is accurate.",
      "All activities that occur under your account.",
    ],
    footer:
      "You must notify your administrator immediately if you believe your account has been compromised.",
  },
  {
    id: "acceptable",
    number: "3",
    title: "Acceptable Use",
    content: ["You may not:"],
    list: [
      "Use the platform for unlawful purposes.",
      "Attempt to gain unauthorized access to systems or data.",
      "Interfere with the security or operation of the platform.",
      "Upload malicious software, harmful code, or unauthorized content.",
      "Use the platform in a manner that could disrupt other users.",
    ],
  },
  {
    id: "data",
    number: "4",
    title: "Data and Content",
    content: [
      "You retain ownership of the content and information you upload to the platform.",
      "By using the platform, you grant us the limited rights necessary to store, process, and display your content solely for the purpose of providing the service.",
    ],
  },
  {
    id: "availability",
    number: "5",
    title: "Availability",
    content: [
      "We strive to maintain reliable service but do not guarantee uninterrupted availability.",
      "The platform may be temporarily unavailable due to maintenance, updates, security measures, or circumstances beyond our control.",
    ],
  },
  {
    id: "ip",
    number: "6",
    title: "Intellectual Property",
    content: [
      "All software, branding, designs, logos, and platform features provided by Axis Command remain the property of Astra Group of Companies, Inc. and are protected by applicable intellectual property laws.",
    ],
  },
  {
    id: "termination",
    number: "7",
    title: "Termination",
    content: ["We reserve the right to suspend or terminate access to the platform if:"],
    list: [
      "These terms are violated.",
      "Unauthorized or harmful activity is detected.",
      "Access is no longer authorized by the account owner or organization.",
    ],
  },
  {
    id: "liability",
    number: "8",
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Astra Group of Companies, Inc. shall not be liable for indirect, incidental, special, or consequential damages arising from the use of the platform.",
    ],
  },
  {
    id: "changes",
    number: "9",
    title: "Changes to These Terms",
    content: [
      "We may update these Terms of Service from time to time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "contact",
    number: "10",
    title: "Contact",
    content: [
      "If you have questions regarding these Terms of Service, please contact:",
    ],
    contact: {
      name: "Astra Group of Companies, Inc.",
      email: "sales@astragroupph.com",
    },
  },
];

/* ────────────────────────────────
  PROPS
──────────────────────────────── */
interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ────────────────────────────────
  COMPONENT
──────────────────────────────── */
export default function TermsOfServiceModal({
  isOpen,
  onClose,
}: TermsOfServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex h-[100dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border-zinc-200/80 p-0 shadow-2xl sm:h-[90vh] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl"
        showCloseButton={false}
      >
        {/* HEADER */}
        <DialogHeader className="relative shrink-0 border-b border-zinc-200/80 bg-gradient-to-b from-[#430062]/[0.06] to-white px-4 pb-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#430062]/10">
                <FileText className="h-5 w-5 text-[#430062]" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold text-zinc-900 sm:text-2xl">
                  Terms of Service
                </DialogTitle>
                <p className="text-sm text-zinc-500">
                  Last Updated:{" "}
                  <span className="font-medium text-zinc-700">
                    June 1, 2026
                  </span>
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* BODY — single scrollable area */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 sm:px-6 lg:px-8">
          {/* INTRO */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="border-l-4 border-[#430062] pl-4">
              <p className="text-sm text-zinc-600">
                Welcome to <span className="font-semibold text-zinc-900">Axis Command</span>.
              </p>

              <p className="mt-2 text-sm text-zinc-600">
                By accessing or using Axis Command, you agree to these Terms of Service.
              </p>
            </div>
            <div className="mt-6 space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="border-t border-zinc-100 pt-6"
              >
                {/* TITLE */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#430062] text-xs font-bold text-white sm:h-8 sm:w-8">
                    {section.number}
                  </div>

                  <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
                    {section.title}
                  </h2>
                </div>

                {/* CONTENT */}
                <div className="space-y-3">
                  {section.content.map((text, i) => (
                    <p key={i} className="text-sm text-zinc-600">
                      {text}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#430062]/60" />
                          <span className="text-sm text-zinc-600">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      {section.footer}
                    </div>
                  )}

                  {section.contact && (
                    <div >
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                        <Shield className="h-4 w-4 text-[#430062]" />
                        {section.contact.name}
                      </div>

                      <a
                        href={`mailto:${section.contact.email}`}
                        className="mt-2 inline-flex items-center gap-2 text-sm text-[#430062] hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {section.contact.email}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    </div>
                  )}
                </div>
              </section>
            ))}
            
          </div>
          </div>

          {/* SECTIONS */}
          

          {/* FOOTER */}
          <div className="mt-8 pb-4 text-center text-xs text-zinc-400">
            © 2026 Astra Group of Companies, Inc. All rights reserved.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}