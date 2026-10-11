"use client";

import React from "react";
import AuthModal from "@/components/AuthModal";

export default function StandaloneLoginPage() {
  return (
    <main className="page-container">
      <AuthModal standalone={true} />
    </main>
  );
}
