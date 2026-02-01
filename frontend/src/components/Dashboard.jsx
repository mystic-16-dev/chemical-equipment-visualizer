import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import FileUpload from './FileUpload';
import DataTable from './DataTable';
import EquipmentBarChart from './Charts/EquipmentBarChart';
import ParamCharts from './Charts/ParamCharts';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import api from '../api';
import { useSearchParams } from 'react-router-dom';

const Dashboard = ({ setIsAuthenticated }) => {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            fetchData(id);
        }
    }, [searchParams]);

    const handleUploadSuccess = async (response) => {
        const datasetId = response && response.id;
        if (datasetId) {
            await fetchData(datasetId);
        }
    };

    const fetchData = async (id) => {
        setLoading(true);
        setCurrentId(id);
        try {
            const dataReq = api.get(`data/${id}/`);
            const summaryReq = api.get(`summary/${id}/`);
            const [dataRes, summaryRes] = await Promise.all([dataReq, summaryReq]);

            setData(dataRes.data);
            setSummary(summaryRes.data.summary_data);
        } catch (error) {
            console.error("Error fetching dataset data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!currentId) return;
        try {
            const response = await api.get(`report/${currentId}/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${currentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading report:", error);
            alert("Failed to download report. Please check if you are logged in.");
        }
    };

    return (
        <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
            <div className="container">

                {/* Top Section: Upload & Recent Activity */}
                <div className="grid-dashboard">
                    {/* Left: Upload Widget */}
                    <div className="card">
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Upload Dataset</h2>
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </div>

                    {/* Right: Recent Activity Widget */}
                    <div style={{ height: '100%' }}>
                        <RecentActivity />
                    </div>
                </div>

                {/* Dashboard Header Actions */}
                {currentId && (
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem' }}>Analysis Results</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Dataset ID: {currentId}</p>
                        </div>
                        <button onClick={handleDownloadReport} className="btn btn-primary">
                            <span style={{ marginRight: '8px' }}>📥</span> Download PDF Report
                        </button>
                    </div>
                )}


                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading analysis data...</div>
                    </div>
                )}

                {!loading && data.length > 0 && (
                    <>
                        {/* Quick Stats Row */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Quick Stats</h3>
                            <StatsCards summary={summary} />
                        </div>

                        {/* Charts Section */}
                        <div style={{ marginBottom: '2rem' }}>
                            <div className="card" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Equipment Count</h3>
                                <div style={{ height: '400px' }}> {/* Fixed height for better presentation */}
                                    <EquipmentBarChart data={data} />
                                </div>
                            </div>

                            <div className="card">
                                <h3 style={{ marginBottom: '1rem' }}>Parameter Distribution</h3>
                                <ParamCharts data={data} />
                            </div>
                        </div>

                        {/* Data Table Section */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>Detailed Data</h3>
                            <DataTable data={data} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

