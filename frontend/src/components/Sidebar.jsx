import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "is-active" : ""}`;

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        AI Assistant
      </h2>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={linkClass}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/documents"
          className={linkClass}
        >
          Documents
        </NavLink>

        <NavLink
          to="/chat"
          className={linkClass}
        >
          Chat
        </NavLink>

        <NavLink
          to="/email"
          className={linkClass}
        >
          Email
        </NavLink>

        <NavLink
          to="/leads"
          className={linkClass}
        >
          Leads
        </NavLink>

        <NavLink
          to="/reports"
          className={linkClass}
        >
          Reports
        </NavLink>

        <NavLink
          to="/settings"
          className={linkClass}
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
