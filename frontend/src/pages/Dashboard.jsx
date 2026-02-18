import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <div className="avatar-container">
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt="Profile" 
            className="profile-avatar"
          />
        </div>
        <div className="user-info">
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;