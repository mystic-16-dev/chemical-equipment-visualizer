
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Profile = ({ setIsAuthenticated }) => {
    const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";

    const [user, setUser] = useState({
        name: localStorage.getItem('userName') || 'J. Profile',
        email: localStorage.getItem('userEmail') || 'j.profile@example.com',
        role: localStorage.getItem('userRole') || 'Data Analyst',
        bio: localStorage.getItem('userBio') || 'Passionate about chemical equipment data visualization.',
        avatar: localStorage.getItem('userAvatar') || defaultAvatar
    });

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newAvatar = reader.result;
                setUser({ ...user, avatar: newAvatar });
                localStorage.setItem('userAvatar', newAvatar);

                // Dispatch event so Navbar updates immediately
                window.dispatchEvent(new Event('avatarUpdated'));

                setMessage('Avatar updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        // Persist details to localStorage
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userBio', user.bio);

        // Dispatch event so Navbar updates name immediately
        window.dispatchEvent(new Event('userUpdated'));

        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
            <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '2rem' }}>User Profile</h2>

                {/* Profile Header Card */}
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#ddd',
                            overflow: 'hidden',
                            border: '4px solid white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <label htmlFor="avatar-upload" style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: 'var(--secondary-color)',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            fontSize: '0.9rem'
                        }} title="Change Avatar">
                            📷
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{user.name}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{user.role}</p>
                    </div>
                </div>

                {/* Details Form Card */}
                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3>Personal Information</h3>
                        <button
                            onClick={isEditing ? handleSave : () => setIsEditing(true)}
                            className="btn btn-primary"
                        >
                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                />
                            ) : (
                                <div style={{ fontWeight: '500' }}>{user.name}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                />
                            ) : (
                                <div style={{ fontWeight: '500' }}>{user.email}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={user.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                                />
                            ) : (
                                <div style={{ lineHeight: '1.6' }}>{user.bio}</div>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: message.includes('success') ? '#D1FAE5' : '#FEE2E2', color: message.includes('success') ? '#065F46' : '#991B1B', borderRadius: '6px', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}
                </div>

                {/* Additional Settings Section (Placeholder) */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <h3>Account Settings</h3>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#F9FAFB', borderRadius: '6px' }}>
                        <div className="flex-between">
                            <span>Email Notifications</span>
                            <div style={{ width: '40px', height: '20px', background: 'var(--secondary-color)', borderRadius: '10px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                            </div>
                        </div>
                        <div className="flex-between" style={{ marginTop: '1rem' }}>
                            <span>Dark Mode (Coming Soon)</span>
                            <div style={{ width: '40px', height: '20px', background: '#D1D5DB', borderRadius: '10px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
