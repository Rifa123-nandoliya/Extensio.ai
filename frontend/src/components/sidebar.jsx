import {
  FiHome,
  FiFolder,
  FiGrid,
  FiSettings
} from "react-icons/fi";

function Sidebar({
  activePage,
  setActivePage
}) {

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome />
    },
    {
      id: "extensions",
      label: "My Extensions",
      icon: <FiFolder />
    },
    {
      id: "templates",
      label: "Templates",
      icon: <FiGrid />
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings />
    }
  ];

  return (
    <div className="w-64 bg-black text-white min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        Extensio.ai
      </h1>

      <nav className="space-y-3">

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`
              w-full
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              transition-all
              duration-200

              ${
                activePage === item.id
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }
            `}
          >
            {item.icon}

            <span>{item.label}</span>
          </button>
        ))}

      </nav>
    </div>
  );
}

export default Sidebar;