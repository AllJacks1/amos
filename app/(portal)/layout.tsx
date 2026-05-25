import AMOSLayout from "@/components/pages/MainNavigationBar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AMOSLayout>{children}</AMOSLayout>;
}
