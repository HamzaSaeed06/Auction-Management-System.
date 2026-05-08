"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { useAuth } from "../lib/auth";
import { Spinner } from "./UI";

function redirectByRole(role) {
  if (role === "Super Admin") return "/super-admin";
  if (role === "Admin") return "/admin";
  if (role === "Franchise") return "/franchise";
  return "/";
}

export default function DashboardLayout({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(redirectByRole(user.role));
    }
  }, [allowedRoles, loading, router, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner size={32} />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 flex-col lg:flex-row">
      <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 ml-0 lg:ml-64"
      >
        <div className="p-3 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
