import { NavLink, useNavigate } from "react-router-dom";
import { MessageSquare, Folder, Users, LogOut, X, Contact2, Shield } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { handleLogout } from "../api/api";
import { useAuth } from "../hooks/useAuth";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const menu = [
  { name: "Chat", icon: <MessageSquare size={18} />, path: "/chat" },
  { name: "File Management", icon: <Folder size={18} />, path: "/files" },
  { name: "Sheets Management", icon: <Folder size={18} />, path: "/sheets" },
  { name: "Contacts Management", icon: <Contact2 size={18} />, path: "/contacts" },
  { name: "Users Management", icon: <Users size={18} />, path: "/users" },
  { name: "Roles Management", icon: <Shield size={18} />, path: "/roles" },
];

const menuVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  }),
};

const SideBar = ({ isOpen, setIsOpen }: Props) => {
  const { userDetail } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-red-100 text-red-600 font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white shadow-md flex-col shrink-0">
        {/* User Info */}
        <div className="h-20 flex items-center gap-3 px-4 border-b">
          <motion.img
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            src={
              userDetail?.picture ||
              "https://ui-avatars.com/api/?name=" + (userDetail?.name || "Guest")
            }
            alt="avatar"
            className="w-10 h-10 rounded-full border object-cover"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm truncate">
              {userDetail?.name || "Guest"}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {userDetail?.email || "No email"}
            </span>
          </div>
        </div>

        {/* Menu List */}
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={menuVariants}
            >
              <NavLink to={item.path} className={linkClass}>
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </motion.div>
          ))}

          {/* Logout button desktop */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
            onClick={() => handleLogout(navigate)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </nav>
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col rounded-r-2xl"
              initial={{ x: -300, scale: 0.95, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              {/* User Info */}
              <div className="h-20 flex items-center gap-3 px-4 border-b relative">
                <motion.img
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  src={
                    userDetail?.picture ||
                    "https://ui-avatars.com/api/?name=" +
                      (userDetail?.name || "Guest")
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate">
                    {userDetail?.name || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {userDetail?.email || "No email"}
                  </span>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setIsOpen(false)}
                  className="ml-auto"
                >
                  <X size={22} />
                </motion.button>
              </div>

              {/* Menu List */}
              <nav className="flex-1 p-4 space-y-2">
                {menu.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={menuVariants}
                  >
                    <NavLink
                      to={item.path}
                      className={linkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  </motion.div>
                ))}

                {/* Logout button mobile */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    handleLogout(navigate);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;
