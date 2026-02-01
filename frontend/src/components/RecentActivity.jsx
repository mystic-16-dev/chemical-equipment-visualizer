import React, { useEffect, useState } from 'react';
import api from '../api';

const RecentActivity = () => {
    const [recentUploads, setRecentUploads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('history/');
            // Take only the last 5 itmes
            setRecentUploads(response.data.slice(0, 5));
        } catch (error) {
            console.error("Error fetching recent activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`report/${id}/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading report:", error);
            alert("Failed to download report.");
        }
    };

    const getStatusColor = (status) => {
        // Mock status logic since backend might not send it
        return status === 'Failed' ? '#FEE2E2' : '#D1FAE5';
    };

    const getStatusText = (status) => {
        return status === 'Failed' ? '#DC2626' : '#059669';
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Activity</h3>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Dataset</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>Date</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: '500', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUploads.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                    {item.dataset_name}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                                    {new Date(item.upload_timestamp).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                                    <span style={{
                                        background: getStatusColor(item.status || 'Uploaded'),
                                        color: getStatusText(item.status || 'Uploaded'),
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {item.status || 'Uploaded'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDownload(item.id)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '6px',
                                            padding: '0.4rem',
                                            cursor: 'pointer',
                                            color: 'var(--text-secondary)',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Download Report"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--secondary-color)';
                                            e.currentTarget.style.borderColor = 'var(--secondary-color)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.borderColor = 'var(--border-color)';
                                        }}
                                    >
                                        📥
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {recentUploads.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    No recent activity
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivity;
