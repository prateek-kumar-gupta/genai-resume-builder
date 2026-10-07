import React from 'react';
import { Link } from 'react-router';
import { LayersIcon, LogOutIcon, UserIcon, HistoryIcon, TargetIcon } from './Icons';
import { useAuth } from '../../auth/hooks/useAuth';

const Navbar = ({ onOpenHistory, hasActiveReport, onBackToEditor }) => {
    const { user, handleLogout } = useAuth();

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={onBackToEditor} role="button" tabIndex={0} title="Return to Interview Setup">
                    <div className="logo-icon-box" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'}}>
                        <LayersIcon size={20} className="logo-sparkle" />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">Career<span className="gradient-text">Craft</span></span>
                        <span className="brand-badge">RESUME & INTERVIEW AI</span>
                    </div>
                </div>



                <div className="navbar-actions">
                    <Link 
                        to="/interview"
                        className="nav-btn subtle-btn"
                        title="Open 3-Column Interview Layout Studio"
                        style={{ textDecoration: 'none' }}
                    >
                        <TargetIcon size={15} />
                        <span>Studio View</span>
                    </Link>

                    {hasActiveReport && (
                        <button 
                            className="nav-btn subtle-btn"
                            onClick={onBackToEditor}
                            title="Edit job description and resume"
                        >
                            ✏️ Edit Inputs
                        </button>
                    )}

                    

                    <button 
                        className="nav-btn subtle-btn"
                        onClick={onOpenHistory}
                        title="View previously generated interview reports"
                    >
                        <HistoryIcon size={16} />
                        <span>History</span>
                    </button>

                    <div className="user-profile-badge">
                        <div className="user-avatar" title={user?.email || "User profile"}>
                            <UserIcon size={15} />
                        </div>
                        <span className="username-text">
                            {user?.username || user?.email?.split('@')[0] || "Candidate"}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="logout-icon-btn"
                            title="Sign out of your account"
                            aria-label="Logout"
                        >
                            <LogOutIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;


