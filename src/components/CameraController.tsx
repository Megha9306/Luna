import { useFrame, useThree } from '@react-three/fiber';
import { useGestureStore } from '../store';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import { useEffect } from 'react';

// Use OrbitControls from drei, but we need to access its instance to control it
export const CameraController = ({ controlsRef }: { controlsRef: MutableRefObject<OrbitControlsImpl | null> }) => {
    const { panDelta, zoomFactor, gesture, inputMode } = useGestureStore();
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (!controlsRef.current) return;

        // --- GESTURE MODE ---
        if (inputMode === 'GESTURE') {
            // Apply Pan
            if (gesture === 'PAN') {
                const speed = 2.0 * delta;

                // panDelta.x: +1 (Right). To look right, rotate camera negative Azimuth
                if (Math.abs(panDelta.x) > 0.05) {
                    controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - panDelta.x * speed);
                }
                if (Math.abs(panDelta.y) > 0.05) {
                    controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - panDelta.y * speed);
                }
                controlsRef.current.update();
            }

            // Apply Zoom (Scale Distance)
            if (gesture === 'ZOOM') {
                const targetDist = 10 / zoomFactor;
                const currentDist = camera.position.length();
                const smooth = 5.0 * delta;

                if (Math.abs(targetDist - currentDist) > 0.1) {
                    const dir = camera.position.clone().normalize();
                    const newDist = THREE.MathUtils.lerp(currentDist, targetDist, smooth);
                    camera.position.copy(dir.multiplyScalar(newDist));
                }
            }
        }
    });

    // Custom Wheel Listener for FOV Zoom interaction (works in both modes theoretically, but mainly for MOUSE comfort)
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (inputMode === 'MOUSE' && camera instanceof THREE.PerspectiveCamera) {
                e.preventDefault();
                // DeltaY is usually +/- 100 per tick.
                const fovDelta = e.deltaY * 0.05;
                const newFov = THREE.MathUtils.clamp(camera.fov + fovDelta, 10, 100);

                camera.fov = newFov;
                camera.updateProjectionMatrix();
            }
        };

        // Use window listener for global capture, or better attach to canvas if possible.
        // For simplicity, window is robust for full screen app.
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [inputMode, camera]);

    return null;
};
