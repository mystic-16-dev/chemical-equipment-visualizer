import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import { SiEquinixmetal } from "react-icons/si";
import './Login.css'; // Reusing Login styles for consistency

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post('register/', { username, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username may be taken.');
            console.error(err);
        }
    };

    return (
        <div className="login-page">
            {/* Left Side - Dark Purple Gradient */}
            <div className="login-bg-left">
                <div className="brand-watermark">
                    <SiEquinixmetal /> EquipView
                </div>
            </div>

            {/* Right Side - Light Background */}
            <div className="login-bg-right"></div>

            {/* Floating Card (Centered) */}
            <div className="login-card-container">
                <div className="login-card">
                    <h2 className="login-title">Create Account</h2>

                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <FiLock className="input-icon" />
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="input-error">{error}</div>}

                        <button type="submit" className="login-btn">
                            Sign Up
                        </button>

                        <div className="login-footer" style={{ justifyContent: 'center' }}>
                            <Link to="/login" className="footer-link">Already have an account? Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
