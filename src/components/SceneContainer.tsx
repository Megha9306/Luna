import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { StarField } from './StarField';
import { Constellations } from './Constellations';
import { CameraController } from './CameraController';
import { InteractionController } from './InteractionController';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import { useGestureStore } from '../store';
import { calculateLST } from '../utils/time';

export const SceneContainer = () => {
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const { observerLocation, observerDate, autoRotate } = useGestureStore();

    // 1. Calculate LST (Local Sidereal Time)
    // This is the rotation around the Earth's axis (Y-axis in our scene, effectively)
    const lstRad = calculateLST(observerDate, observerLocation.lon);

    // 2. Calculate Latitude Rotation
    // Latitude determines how "tilted" the sky seems.
    // At Lat 90 (North Pole), Polaris is at Zenith (up).
    // At Lat 0 (Equator), Polaris is at Horizon.
    // Our star coordinates are likely Equatorial (RA/Dec).
    // So we need to rotate the entire celestial sphere.
    // 
    // If we assume Y is North Celestial Pole in standard coords:
    // We want to tilt the whole group so that the NCP points to the correct altitude.
    // Altitude of NCP = Observer Latitude.
    // So we rotate around X axis by (90 - Lat) degrees? 
    // Or just rotate the camera? Moving the sky is easier for fixed camera controls.

    // Let's try rotating the Sky Group.
    // Initial: Y is Up (NCP).
    // We want NCP to be at angle Lat from Horizon (Z-X plane).
    // So we rotate around X axis by -(90 - Lat).
    const latRad = (90 - observerLocation.lat) * (Math.PI / 180);

    // Group Structure:
    // Outer Group: Adjusts for Latitude (tilts the whole axis)
    //   Inner Group: Adjusts for Time (rotates around the axis)
    //     Stars & Constellations

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                raycaster={{
                    params: {
                        Line: { threshold: 5 }
                    } as any // eslint-disable-line @typescript-eslint/no-explicit-any
                }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />

                    <group rotation={[latRad, 0, 0]}>
                        <group rotation={[0, -lstRad, 0]}>
                            <StarField />
                            <Constellations />
                        </group>
                    </group>

                    <CameraController controlsRef={controlsRef} />
                    <InteractionController />

                    <OrbitControls
                        ref={controlsRef}
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={autoRotate}
                        autoRotateSpeed={0.2}
                        rotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
