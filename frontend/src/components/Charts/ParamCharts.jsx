import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ParamCharts = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Assuming data has 'Flowrate', 'Pressure', 'Temperature' keys.
    // We'll use index or ID as labels.
    const labels = data.map((_, index) => index + 1);

    const createChartData = (label, key, color) => ({
        labels,
        datasets: [
            {
                label,
                data: data.map(item => item[key]),
                borderColor: color,
                backgroundColor: color.replace('1)', '0.5)'),
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Flowrate</h3>
                <Line data={createChartData('Flowrate', 'Flowrate', 'rgba(75, 192, 192, 1)')} options={options} />
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Pressure</h3>
                <Line data={createChartData('Pressure', 'Pressure', 'rgba(255, 99, 132, 1)')} options={options} />
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Temperature</h3>
                <Line data={createChartData('Temperature', 'Temperature', 'rgba(255, 206, 86, 1)')} options={options} />
            </div>
        </div>
    );
};

export default ParamCharts;
