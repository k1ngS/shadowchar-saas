import Header from "~/app/_components/header";
import { Notifications } from "../_components/notifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {children}
      <Notifications />
    </div>
  );
}