import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import { Menu } from "lucide-react";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar untuk mobile */}
        <header className="md:hidden h-14 bg-white shadow flex items-center px-4 shrink-0">
          <button onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-bold text-base">IDStar Portal</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default App;
