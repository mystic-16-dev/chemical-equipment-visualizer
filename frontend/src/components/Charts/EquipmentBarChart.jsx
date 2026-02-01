import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EquipmentBarChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    // 1. Group data by type
    const groupedData = {};
    data.forEach(item => {
        const type = item['Type'] || item['Equipment Type'] || item['equipment_type'] || 'Unknown';
        if (!groupedData[type]) groupedData[type] = [];
        groupedData[type].push(item);
    });

    const labels = Object.keys(groupedData);

    // 2. Determine max stack height (max number of items in any category)
    const maxCount = Math.max(...Object.values(groupedData).map(arr => arr.length));

    // Base Hue mapping for types (to keep consistent colors per type)
    const typeHues = {};
    labels.forEach((label, index) => {
        // Distribute hues across 360 degrees
        typeHues[label] = (index * 137.5) % 360; // Golden angle approx for variety
    });

    // 3. Create stacked datasets
    const datasets = [];
    for (let i = 0; i < maxCount; i++) {
        const dataset = {
            label: `Unit ${i + 1}`, // Generic label for the stack layer
            data: labels.map(label => {
                // If this type has an item at index i, value is 1, else 0
                return groupedData[label][i] ? 1 : 0;
            }),
            backgroundColor: labels.map(label => {
                // Vary lightness based on stack index to create "shades"
                // Range Lightness from 40% to 80% to keep it visible
                const baseHue = typeHues[label];
                const lightness = 40 + (i * 10);
                return `hsl(${baseHue}, 70%, ${lightness}%)`;
            }),
            borderColor: '#fff',
            borderWidth: 1,
            barPercentage: 0.6,
        };
        datasets.push(dataset);
    }

    const chartData = {
        labels,
        datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Hide legend as "Unit 1...N" isn't very useful globally
            title: { display: true, text: 'Equipment Detail Count (Stacked)' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // Custom tooltip to show details of the specific item if available
                        const type = context.label;
                        const stackIndex = context.datasetIndex;
                        const item = groupedData[type][stackIndex];
                        if (item) {
                            // Try to find a name or ID, else fallback
                            const name = item['Name'] || item['ID'] || item['id'] || `Unit ${stackIndex + 1}`;
                            return `${name}: ${type}`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: { stacked: true },
            y: {
                stacked: true,
                ticks: { stepSize: 1 }
            }
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
                <Bar data={chartData} options={options} />
            </div>
            <div style={{
                marginLeft: '20px',
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                minWidth: '150px'
            }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>Legend</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {labels.map(label => (
                        <li key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem' }}>
                            <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '3px',
                                backgroundColor: `hsl(${typeHues[label]}, 70%, 50%)`, // Use a middle shade for legend
                                marginRight: '8px',
                                display: 'inline-block'
                            }}></span>
                            {label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EquipmentBarChart;
