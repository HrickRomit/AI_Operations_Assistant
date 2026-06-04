import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";

const TopNavBar = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="top-nav-bar">
      <div className="search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search" />
      </div>
      <div className="top-nav-right">
        <button className="icon-btn notification-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <span className="badge"></span>
        </button>
        <div className="user-profile" onClick={logout} title="Click to sign out" style={{ cursor: 'pointer' }}>
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.business_name || 'User')}`} alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">{user?.business_name || 'User'}</span>
            <span className="user-role">{user?.email || 'Admin'} (Sign Out)</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <div className="dashboard-main">
        <TopNavBar />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
