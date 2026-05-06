import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
