import CreateHabitModal from "./components/CreateHabitModal";
import HabitsHeader from "./components/HabitsHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <>
      <HabitsHeader />
      <CreateHabitModal />
      <div className="flex flex-col h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
