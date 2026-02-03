import { useThree } from '@react-three/fiber';
import { useGestureStore } from '../store';
import { useEffect } from 'react';
import * as THREE from 'three';
import { convertCelestialToCartesian } from '../utils/astronomy';
import { calculateLST } from '../utils/time';
import constellationsRaw from '../data/constellations.json';

const STAR_RADIUS = 500;

export const InteractionController = () => {
    const { camera } = useThree();
    const { selectedConstellation, observerLocation, observerDate } = useGestureStore();

    useEffect(() => {
        if (selectedConstellation) {
            // Find coordinates of the constellation
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const feature = constellationsRaw.features.find((f: any) => f.id === selectedConstellation);
            if (feature) {
                const firstLine = feature.geometry.coordinates[0];
                const [ra, dec] = firstLine[0]; // [RA, Dec]

                // 1. Get the local position of the star in the Sky Group
                // (before any scene rotation)
                const [x, y, z] = convertCelestialToCartesian(ra, dec, STAR_RADIUS);

                // 2. Apply the Scene Rotations to get World Position
                // Scene hierarchy:
                // Outer Group: Rotation X (90 - Lat)
                // Inner Group: Rotation Y (-LST)
                // Star is inside Inner Group.

                const starLocal = new THREE.Vector3(x, y, z);

                // Rotation for LST (around Y axis)
                const lstRad = calculateLST(observerDate, observerLocation.lon);
                const rotY = new THREE.Matrix4().makeRotationY(-lstRad);

                // Rotation for Latitude (around X axis)
                const latRad = (90 - observerLocation.lat) * (Math.PI / 180);
                const rotX = new THREE.Matrix4().makeRotationX(latRad);

                // Transform: World = RotX * RotY * Local
                const starWorld = starLocal.clone();
                starWorld.applyMatrix4(rotY); // Apply Inner rotation first
                starWorld.applyMatrix4(rotX); // Then Outer rotation

                // 3. Move Camera to look at this World Position
                // We want the camera to be at a position such that it looks towards 'starWorld'.
                // Since we are at the center (0,0,0) looking out at the sphere, 
                // we want the camera to be rotated to align with 'starWorld'.
                // BUT OrbitControls is active. It orbits around a target (default 0,0,0).
                // If we want to simulate "Looking At" a star while using OrbitControls at the center:
                // We usually position the camera at (0,0,0) and look at the star.
                // However, our scene seems to be "Outside Looking In" or "Inside Looking Out" hybrid?
                // SceneContainer puts camera at [0,0,10]. Stars at 500.
                // We are inside.
                // To look at a star, we should place the camera such that it faces the star.
                // Since OrbitControls targets 0,0,0, the Camera MUST face 0,0,0.
                // So we must place the Camera on the line connecting Star and Origin, on the opposite side.
                // Configuration: [Star] --- [Origin] --- [Camera] -> Looking at Origin.
                // So Camera Position = - (Normalized Star World Vector) * CameraDistance.

                const cameraDist = 10;
                const lookDir = starWorld.clone().normalize();
                const newCamPos = lookDir.clone().negate().multiplyScalar(cameraDist);

                camera.position.copy(newCamPos);
                camera.lookAt(0, 0, 0);
                // Note: OrbitControls will update effectively on next frame.
                // Because we set position and it looks at 0,0,0 (which is OrbitControls target by default),
                // this is compatible with OrbitControls state.
            }
        }
    }, [selectedConstellation, camera, observerLocation, observerDate]);

    return null;
};
