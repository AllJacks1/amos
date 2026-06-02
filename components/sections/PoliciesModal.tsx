"use client";

import React from "react";
import {
  Lock,
  Shield,
  Mail,
  ExternalLink,
  X,
  Database,
  Eye,
  Server,
  Users,
  Clock,
  Hand,
  Puzzle,
  UserCheck,
  Baby,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* ────────────────────────────────
  CONFIG
──────────────────────────────── */
const BRAND_COLOR = "#430062";

/* ────────────────────────────────
  ICON MAP
──────────────────────────────── */
const sectionIcons: Record<string, React.ReactNode> = {
  "1": <Database className="h-4 w-4" />,
  "2": <Eye className="h-4 w-4" />,
  "3": <Shield className="h-4 w-4" />,
  "4": <Users className="h-4 w-4" />,
  "5": <Clock className="h-4 w-4" />,
  "6": <Hand className="h-4 w-4" />,
  "7": <Puzzle className="h-4 w-4" />,
  "8": <UserCheck className="h-4 w-4" />,
  "9": <Baby className="h-4 w-4" />,
  "10": <RefreshCw className="h-4 w-4" />,
  "11": <Mail className="h-4 w-4" />,
};

/* ────────────────────────────────
  TYPES
──────────────────────────────── */
type ListItem = {
  title: string;
  items: string[];
};

type Section = {
  id: string;
  number: string;
  title: string;
  content: string[];
  lists?: ListItem[];
  footer?: string;
  contact?: {
    name: string;
    email: string;
  };
};

/* ────────────────────────────────
  DATA
──────────────────────────────── */
const sections: Section[] = [
  {
    id: "collect",
    number: "1",
    title: "Information We Collect",
    content: ["We may collect the following information:"],
    lists: [
      {
        title: "Account Information",
        items: [
          "Name",
          "Email address",
          "Organization or company information",
          "User role and permissions",
        ],
      },
      {
        title: "Platform Usage Information",
        items: [
          "Login activity",
          "Content created or uploaded within the platform",
          "Reports, approvals, comments, and workflow activity",
        ],
      },
    ],
  },
  {
    id: "use",
    number: "2",
    title: "How We Use Information",
    content: ["We use collected information to:"],
    lists: [
      {
        title: "",
        items: [
          "Provide and maintain the platform",
          "Authenticate users and manage accounts",
          "Enable collaboration and workflow features",
          "Improve platform performance and reliability",
          "Monitor security and prevent unauthorized access",
          "Provide customer support",
          "Comply with legal obligations",
        ],
      },
    ],
  },
  {
    id: "security",
    number: "3",
    title: "Data Storage and Security",
    content: [
      "We implement reasonable administrative, technical, and organizational measures to protect information from unauthorized access, disclosure, alteration, or destruction.",
    ],
    footer:
      "While we strive to protect your information, no method of electronic transmission or storage can be guaranteed to be completely secure.",
  },
  {
    id: "sharing",
    number: "4",
    title: "Sharing of Information",
    content: [
      "We do not sell personal information.",
      "Information may be shared only when:",
    ],
    lists: [
      {
        title: "",
        items: [
          "Required to operate and maintain the platform",
          "Required by law or legal process",
          "Necessary to protect the rights, security, or property of users or the platform",
          "Authorized by the account owner or organization",
        ],
      },
    ],
  },
  {
    id: "retention",
    number: "5",
    title: "Data Retention",
    content: ["We retain information only for as long as necessary to:"],
    lists: [
      {
        title: "",
        items: [
          "Provide services to your organization",
          "Maintain records and reporting history",
          "Comply with legal, regulatory, or contractual obligations",
        ],
      },
    ],
    footer:
      "When information is no longer required, it may be securely deleted or anonymized.",
  },
  {
    id: "responsibilities",
    number: "6",
    title: "User Responsibilities",
    content: ["Users are responsible for:"],
    lists: [
      {
        title: "",
        items: [
          "Protecting account credentials",
          "Maintaining accurate account information",
          "Using the platform in accordance with applicable laws and company policies",
        ],
      },
    ],
  },
  {
    id: "third-party",
    number: "7",
    title: "Third-Party Services",
    content: [
      "The platform may integrate with third-party services such as analytics, cloud storage, communication tools, or authentication providers.",
      "Those services operate under their own privacy policies and terms.",
    ],
  },
  {
    id: "rights",
    number: "8",
    title: "Your Rights",
    content: ["Depending on applicable laws, users may have the right to:"],
    lists: [
      {
        title: "",
        items: [
          "Request access to personal information",
          "Request correction of inaccurate information",
          "Request deletion of personal information where permitted",
          "Object to certain processing activities",
        ],
      },
    ],
    footer: "Requests may be submitted using the contact information below.",
  },
  {
    id: "children",
    number: "9",
    title: "Children's Privacy",
    content: [
      "Axis Command is intended for business and professional use and is not directed toward individuals under the age of 18.",
      "We do not knowingly collect information from children.",
    ],
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      'Any updates will be posted on this page with a revised "Last Updated" date.',
      "Continued use of the platform after updates become effective constitutes acceptance of the revised policy.",
    ],
  },
  {
    id: "contact",
    number: "11",
    title: "Contact Us",
    content: [
      "If you have questions regarding this Privacy Policy or your information, please contact:",
    ],
    contact: {
      name: "Astra Group of Companies, Inc.",
      email: "support@astragroupph.com",
    },
  },
];

/* ────────────────────────────────
  PROPS
──────────────────────────────── */
interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ────────────────────────────────
  COMPONENT
──────────────────────────────── */
export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="flex h-[95dvh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border-zinc-200/80 p-0 shadow-2xl sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl"
        showCloseButton={false}
      >
        {/* HEADER */}
        <DialogHeader className="relative shrink-0 border-b border-zinc-200/80 bg-gradient-to-b from-[#430062]/[0.06] to-white px-4 pb-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#430062] via-[#6b1a8f] to-[#a855f7]" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#430062]/10">
                <Lock className="h-5 w-5 text-[#430062]" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold text-zinc-900 sm:text-2xl">
                  Privacy Policy
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Privacy Policy for Axis Command platform
                </DialogDescription>
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
              aria-label="Close"
              className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6 sm:px-6 lg:px-8">
          {/* INTRO */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="border-l-4 border-[#430062] pl-4">
              <p className="text-sm text-zinc-600">
                This Privacy Policy explains how we collect, use, store, and
                protect information when you use{" "}
                <span className="font-semibold text-zinc-900">
                  Axis Command
                </span>
                .
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
                      {sectionIcons[section.number] ? (
                        <span className="scale-90">
                          {sectionIcons[section.number]}
                        </span>
                      ) : (
                        section.number
                      )}
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

                    {section.lists?.map((list, listIndex) => (
                      <div key={listIndex}>
                        {list.title && (
                          <p className="mb-2 text-sm font-semibold text-zinc-800">
                            {list.title}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {list.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#430062]/60" />
                              <span className="text-sm text-zinc-600">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {section.footer && (
                      <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {section.footer}
                      </div>
                    )}

                    {section.contact && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                          <Shield className="h-4 w-4 text-[#430062]" />
                          {section.contact.name}
                        </div>

                        <a
                          href={`mailto:${section.contact.email}`}
                          className="inline-flex items-center gap-2 text-sm text-[#430062] hover:underline"
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
