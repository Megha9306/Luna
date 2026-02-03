import { useThree } from '@react-three/fiber';
import { useGestureStore } from '../store';
import { useEffect } from 'react';
import * as THREE from 'three';
import { convertCelestialToCartesian } from '../utils/astronomy';
import constellationsRaw from '../data/constellations.json';

const STAR_RADIUS = 500;

export const InteractionController = () => {
    const { camera } = useThree();
    const { selectedConstellation } = useGestureStore();

    useEffect(() => {
        if (selectedConstellation) {
            // Find coordinates of the constellation
            // @ts-ignore
            const feature = constellationsRaw.features.find((f: any) => f.id === selectedConstellation);
            if (feature) {
                // Approximate center by taking first point of first line
                // Ideally, calculate centroid
                const firstLine = feature.geometry.coordinates[0];
                const [ra, dec] = firstLine[0]; // [RA, Dec]

                // Convert to Cartesian
                const [x, y, z] = convertCelestialToCartesian(ra, dec, STAR_RADIUS * 0.8); // 0.8 to be inside looking out? Or just direction.

                // We want to look AT this point.
                // Or better, move camera such that it looks at this point.
                // Since we are at 0,0,0 usually? No, camera is at 0,0,10.
                // We rotate the camera to look at [x,y,z].

                // For OrbitControls, we usually change the target or the camera position.
                // Since we are inside a sphere? No, standard flyover usually means we are outside looking in or inside looking out.
                // Our Scene has stars at radius 500. Camera at 0,0,10.
                // We are inside. To look at a star, we just rotate (lookAt).

                // Animate rotation?
                // For now, let's just snap lookAt. 
                // But OrbitControls fights `lookAt`. We must set OrbitControls target.
                // Actually, if we are at center (0,0,0) looking out?
                // Wait, Camera is at [0,0,10]. Stars at 500.
                // If we want to simulate night sky, usually Camera should be at 0,0,0 and we rotate.
                // But `OrbitControls` rotates the camera around a target (default 0,0,0).

                // If we want to look at a specific constellation, we need to move the camera OR rotate the camera safely.
                // If using OrbitControls with target 0,0,0, rotating the camera means moving it on the sphere surface.

                // Target position for camera:
                // Normalized vector to star * 10 (camera distance)
                const targetDir = new THREE.Vector3(x, y, z).normalize();
                targetDir.multiplyScalar(0.1); // Move camera very close to origin, looking OUT?
                // Actually, OrbitControls defaults to looking AT target (0,0,0).
                // If we want to look AT the sky, we technically are "Inverse Orbit".
                // Usually for Skybox, we put camera at 0,0,0 and verify controls rotate camera.
                // Standard OrbitControls rotates Camera around Target.
                // If Target is 0,0,0, Camera moves on sphere. Visually valid for "Outside looking in" object.
                // For "Inside looking out" (Sky), we want Camera at 0,0,0 and rotate Camera.
                // `OrbitControls` can do this if we set `enablePan={false}` and `enableZoom={false}` ? 
                // Or we use different controls.

                // Current setup: Camera at [0,0,10], Looking at 0,0,0.
                // Stars at 500 radius.
                // Basically we are looking at the "Core" of the universe?
                // No, we are looking at 0,0,0. Stars are behind us?
                // Stars are all around.

                // To look at a star at [x,y,z]:
                // We need to place camera such that -CameraVector points to Star? 
                // No, Camera looks at 0,0,0.
                // So Star must be "behind" 0,0,0 relative to Camera?
                // This is confusing. 

                // FIX: For a sky simulation, Camera should be at 0,0,0 (or close) and controls should rotate LookDirection.
                // OrbitControls rotates the Camera Position around the Target.
                // If we stay at distance 0.1 from 0,0,0, we are effectively just rotating view.

                // Let's assume we maintain the current setup.
                // To "Look at" a constellation, we move the camera to valid spherical coordinates that align the view.

                const lookDist = 10; // Maintain radius 10
                // We want: Camera -> 0,0,0 -> Star
                // So Camera should be Opposite to Star Vector.
                const camNewPos = targetDir.clone().negate().multiplyScalar(lookDist);

                camera.position.copy(camNewPos);
                camera.lookAt(0, 0, 0);
            }
        }
    }, [selectedConstellation, camera]);

    return null;
};
