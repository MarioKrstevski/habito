import CreateHabitModal from "./components/CreateHabitModal";
import EditHabitModal from "./components/EditHabitModal";
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
      <EditHabitModal />
      <div className="flex flex-col h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
