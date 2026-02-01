import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from './Navbar';

const History = ({ setIsAuthenticated }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('history/');
            // Assuming response.data is the list of history items
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    return (
        <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
            <div style={{ padding: '2rem' }}>
                <h2>Upload History</h2>
                {history.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {history.map((item, index) => (
                            <li key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                <Link to={`/?id=${item.id}`} style={{ textDecoration: 'none', color: '#333', display: 'block' }}>
                                    <strong>{item.dataset_name}</strong> - {new Date(item.upload_timestamp).toLocaleString()}
                                    <br />
                                    <small style={{ color: '#666' }}>ID: {item.id} (Click to View)</small>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default History;
