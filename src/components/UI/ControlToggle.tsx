import { MousePointer2, Hand } from 'lucide-react';
import { useGestureStore } from '../../store';

export const ControlToggle = () => {
    const { inputMode, setInputMode } = useGestureStore();

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '24px',
            padding: '4px'
        }}>
            <button
                onClick={() => setInputMode('GESTURE')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: inputMode === 'GESTURE' ? 'white' : 'transparent',
                    color: inputMode === 'GESTURE' ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <Hand size={18} />
                <span>Gesture</span>
            </button>
            <button
                onClick={() => setInputMode('MOUSE')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: inputMode === 'MOUSE' ? 'white' : 'transparent',
                    color: inputMode === 'MOUSE' ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            >
                <MousePointer2 size={18} />
                <span>Mouse</span>
            </button>
        </div>
    );
};
