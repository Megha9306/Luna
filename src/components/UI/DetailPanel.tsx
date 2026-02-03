import { useGestureStore } from '../../store';
import { X, Info, MapPin, BookOpen } from 'lucide-react'; // Added icons
import { constellationNames } from '../../data/constellationNames';
import { getConstellationDetails } from '../../data/constellationDetails';
import { useEffect, useState } from 'react';

export const DetailPanel = () => {
    const { selectedConstellation, setSelectedConstellation } = useGestureStore();
    const [info, setInfo] = useState<any>(null); // Use any or specific type

    useEffect(() => {
        if (selectedConstellation) {
            setInfo(getConstellationDetails(selectedConstellation));
        }
    }, [selectedConstellation]);

    if (!selectedConstellation) return null;

    const fullName = constellationNames[selectedConstellation] || selectedConstellation;

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            width: '300px', // Slightly wider
            background: 'rgba(0,0,0,0.85)', // Darker for readability
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 30,
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
        }}>
            <button
                onClick={() => setSelectedConstellation(null)}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'color 0.2s'
                }}
            >
                <X size={20} />
            </button>

            <h2 style={{ marginTop: 0, marginBottom: '4px', fontSize: '2rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fullName}
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', fontStyle: 'italic' }}>
                {info?.meaning || 'The Constellation'}
            </div>

            {/* Hint Section */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#7dd3fc' }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Locating Hint</span>
                </div>
                <p style={{ margin: 0, lineHeight: '1.5', fontSize: '0.95rem', color: '#e2e8f0' }}>
                    {info?.hint}
                </p>
            </div>

            {/* Description Section */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#a78bfa' }}>
                    <BookOpen size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</span>
                </div>
                <p style={{ margin: 0, lineHeight: '1.5', fontSize: '0.95rem', color: '#cbd5e1' }}>
                    {info?.description}
                </p>
            </div>

        </div>
    );
};
