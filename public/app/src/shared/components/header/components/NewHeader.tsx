
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NewHeader.sass';
import { branding } from '../../../../config/branding';

interface NewHeaderProps {
  isLoggedIn: boolean;
  username?: string;
  onLogout: () => void;
}

const NewHeader: React.FC<NewHeaderProps> = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isNewFilter = location.search.includes('show=new');
  const isPopularFilter = !isNewFilter;

  return (
    <header className="new-header">
      <div className="header-logo" onClick={() => navigate('/')}>
        <img src={branding.logo} alt={branding.name} />
        <span className="logo-text">{branding.name}</span>
      </div>

      {isHomePage && (
        <div className="header-filters">
          <button
            className={`filter-tab ${isPopularFilter ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Popular
          </button>
          <button
            className={`filter-tab ${isNewFilter ? 'active' : ''}`}
            onClick={() => navigate('/?show=new')}
          >
            New
          </button>
        </div>
      )}

      <div className="header-right">
        {isLoggedIn ? (
          <>
            <span className="header-username">{username}</span>
            <button className="header-create-btn" onClick={() => navigate('/submit')}>
              Create
            </button>
            <button className="header-logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-login-btn">
              Login
            </Link>
            <Link to="/join" className="header-join-btn">
              Join
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default NewHeader;
