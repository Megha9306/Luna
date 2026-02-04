import { useGestureStore } from '../store';
import { useEffect } from 'react';

export const InteractionController = () => {
    const { selectedConstellation, setAutoRotate } = useGestureStore();

    useEffect(() => {
        if (selectedConstellation) {
            // Disable auto-rotation when focusing on a constellation
            setAutoRotate(false);

            // Disable auto-rotation when focusing on a constellation
            setAutoRotate(false);
        } else {
            // Optional: Re-enable auto-rotation when nothing is selected
            setAutoRotate(true);
        }
    }, [selectedConstellation, setAutoRotate]);

    return null;
};
