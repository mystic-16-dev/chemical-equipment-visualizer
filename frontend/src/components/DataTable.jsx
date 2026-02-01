import React from 'react';

const DataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available. Upload a CSV file.</p>;
    }

    // Assuming data is a list of objects.
    // We'll dynamically generate headers from the first object, or specific headers if known.
    // The user mentioned "Equipment Data" - likely: Equipment ID, Type, Flowrate, Pressure, Temperature...
    const headers = Object.keys(data[0]);

    return (
        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
            <h3>Equipment Data</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        {headers.map((header) => (
                            <th key={header} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header) => (
                                <td key={header} style={{ border: '1px solid #ddd', padding: '8px' }}>{row[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
