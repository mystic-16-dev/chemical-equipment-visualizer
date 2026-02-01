import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

    // User state for display
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || 'J. Profile');
    const [avatar, setAvatar] = React.useState(localStorage.getItem('userAvatar') || defaultAvatar);

    React.useEffect(() => {
        const handleAvatarUpdate = () => {
            setAvatar(localStorage.getItem('userAvatar') || defaultAvatar);
        };

        const handleUserUpdate = () => {
            setUserName(localStorage.getItem('userName') || 'J. Profile');
        };

        window.addEventListener('avatarUpdated', handleAvatarUpdate);
        window.addEventListener('userUpdated', handleUserUpdate);

        return () => {
            window.removeEventListener('avatarUpdated', handleAvatarUpdate);
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active-link' : '';
    };

    return (
        <nav style={{
            background: 'var(--primary-color)',
            padding: '1rem 2rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>E</span>
                </div>
                <h2 style={{ color: 'white', fontSize: '1.25rem', margin: 0 }}>EquipView</h2>
            </div>

            {/* Navigation Links */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                gap: '0.5rem'
            }}>
                <Link to="/" className={`nav-link ${isActive('/')}`} style={navLinkStyle(isActive('/'))}>
                    <span style={{ marginRight: '8px' }}>📊</span> Dashboard
                </Link>
                <Link to="/history" className={`nav-link ${isActive('/history')}`} style={navLinkStyle(isActive('/history'))}>
                    <span style={{ marginRight: '8px' }}>🕒</span> History
                </Link>
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={navLinkStyle(isActive('/profile'))}>
                    <span style={{ marginRight: '8px' }}>⚙️</span> Profile
                </Link>
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                            <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{userName}</span>
                    </div>
                </Link>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

const navLinkStyle = (isActive, disabled = false) => ({
    textDecoration: 'none',
    color: isActive ? 'var(--primary-color)' : 'white',
    background: isActive ? 'white' : 'transparent',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
});

export default Navbar;
