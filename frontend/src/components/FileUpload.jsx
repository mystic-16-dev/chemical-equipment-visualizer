import React, { useState } from 'react';
import api from '../api';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault(); // Need to prevent default if called from form

        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('dataset_name', file.name);

        setLoading(true);
        setMessage('');
        try {
            const response = await api.post('upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Upload successful!');
            setFile(null); // Reset file after success
            if (onUploadSuccess) onUploadSuccess(response.data);
        } catch (error) {
            console.error('Upload Error:', error);
            setMessage('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${dragActive ? 'var(--secondary-color)' : '#CBD5E1'}`,
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#F3E8FF' : '#F8FAFC',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    cursor: 'pointer'
                }}
            >
                {/* Hidden input for click-to-upload */}
                <input
                    type="file"
                    id="file-input"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <label htmlFor="file-input" style={{ width: '100%', cursor: 'pointer' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {file ? '📄' : '☁️'}
                    </div>

                    {file ? (
                        <div>
                            <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                {file.name}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                Drag and drop zone
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Drag and drop zone.
                            </p>
                        </div>
                    )}
                </label>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                {file ? (
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Uploading...' : 'Upload File'}
                    </button>
                ) : (
                    <label htmlFor="file-input" className="btn btn-primary" style={{ width: '100%' }}>
                        Upload File
                    </label>
                )}
            </div>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: message.includes('success') ? '#D1FAE5' : '#FEE2E2',
                    color: message.includes('success') ? '#065F46' : '#991B1B',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
