import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({
  children,
  title = "Dashboard",
  subtitle,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f4f5]">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <Navbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="mx-auto w-full min-w-0 max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
