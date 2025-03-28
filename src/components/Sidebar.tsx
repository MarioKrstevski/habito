// components/Sidebar.tsx
import { UserIcon, SettingsIcon, FolderIcon } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <div className="flex items-center mb-8">
        <UserIcon className="mr-2" />
        <span>Mario Krstevski</span>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="flex items-center">
              <FolderIcon className="mr-2" />
              My own
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center">
              <SettingsIcon className="mr-2" />
              Manage Habits
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
