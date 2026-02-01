import React from 'react';

const StatsCards = ({ summary }) => {
    if (!summary) return null;

    const cards = [
        {
            label: 'Total Equipment',
            value: summary.total_count || 0,
            unit: 'Units',
            color: 'var(--secondary-color)',
            icon: '🏭'
        },
        {
            label: 'Avg Flowrate',
            value: (summary.avg_flowrate || 0).toFixed(2),
            unit: 'L/min',
            color: '#10B981', // Emerald 500
            icon: '💧'
        },
        {
            label: 'Avg Pressure',
            value: (summary.avg_pressure || 0).toFixed(2),
            unit: 'bar',
            color: '#F59E0B', // Amber 500
            icon: '🌡️'
        },
        {
            label: 'Avg Temperature',
            value: (summary.avg_temperature || 0).toFixed(2),
            unit: '°C',
            color: '#EF4444', // Red 500
            icon: '🔥'
        },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {cards.map((card, index) => (
                <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>

                    {/* Icon Circle */}
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${card.color}20`, // 20% opacity using hex alpha
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        marginRight: '1rem'
                    }}>
                        {card.icon}
                    </div>

                    {/* Content */}
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            {card.label}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {card.value}
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                                {card.unit}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
