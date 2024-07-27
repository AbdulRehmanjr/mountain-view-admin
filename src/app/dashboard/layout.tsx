import {  SideBar } from "~/app/_components/header/Sidebar";
import { Header } from "~/app/_components/header/Header";

export const metadata = {
  title: "PMS | Seller",
  description: "Admin Dashboard to monitor the bicycle app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
     <SideBar/>
      <div className="flex flex-col">
       <Header/>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
         {children}
        </main>
      </div>
    </div>
  );
}
