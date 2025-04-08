
import React from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <main className="flex-1 p-6 md:ml-64">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
