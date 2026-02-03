import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { StarField } from './StarField';
import { Constellations } from './Constellations';
import { CameraController } from './CameraController';
import { InteractionController } from './InteractionController';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export const SceneContainer = () => {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                raycaster={{
                    params: {
                        Line: { threshold: 5 }
                    } as any
                }} // Increase line hit threshold
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />

                    <StarField />
                    <Constellations />

                    <CameraController controlsRef={controlsRef} />
                    <InteractionController />

                    <OrbitControls
                        ref={controlsRef}
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={0.2}
                        rotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
