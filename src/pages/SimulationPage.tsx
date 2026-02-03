import { SceneContainer } from '../components/SceneContainer';
import { GestureController } from '../components/GestureController';
import { SearchBar } from '../components/UI/SearchBar';
import { ControlToggle } from '../components/UI/ControlToggle';
import { DetailPanel } from '../components/UI/DetailPanel';
import { useGestureStore } from '../store';

import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const SimulationPage = () => {
    const { inputMode } = useGestureStore();
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Home Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 40,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                title="Back to Home"
            >
                <Home size={20} />
            </button>

            <SearchBar />

            <SceneContainer />

            {/* Conditional Rendering of GestureController */}
            {inputMode === 'GESTURE' && <GestureController />}

            <ControlToggle />
            <DetailPanel />

            {/* HUD Overlay - Minimal */}
            {inputMode === 'GESTURE' && (
                <div style={{
                    position: 'absolute',
                    top: 80,
                    right: 20,
                    color: 'rgba(255,255,255,0.7)',
                    pointerEvents: 'none',
                    textAlign: 'right',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace'
                }}>
                    <p>✋ Pan</p>
                    <p>🤏 Zoom</p>
                </div>
            )}
        </div>
    );
};
