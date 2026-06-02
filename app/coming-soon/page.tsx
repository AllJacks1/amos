"use client";

import Lottie from "lottie-react";
import comingSoonAnimation from "@/public/lottie/coming-soon.json";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <Lottie animationData={comingSoonAnimation} loop className="h-72 w-72" />

      <p className="max-w-md text-zinc-500">
        This feature is currently under development and will be available in a
        future release.
      </p>
    </div>
  );
}
