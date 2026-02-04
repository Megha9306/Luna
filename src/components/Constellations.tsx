import { useMemo } from 'react';
import * as THREE from 'three';
import constellationsRaw from '../data/constellations.json';
import { convertCelestialToCartesian } from '../utils/astronomy';
import { Line } from '@react-three/drei';
import { useGestureStore } from '../store';

const STAR_RADIUS = 500;

interface ConstellationFeature {
    geometry: {
        type: string;
        coordinates: number[][][]; // MultiLineString: Array of lines, each line is array of points [RA, Dec]
    };
    id: string;
}

export const Constellations = () => {
    const { setSelectedConstellation, selectedConstellation } = useGestureStore();

    const lines = useMemo(() => {
        const features = constellationsRaw.features as ConstellationFeature[];
        return features.map(feature => {
            const shape: THREE.Vector3[][] = [];
            feature.geometry.coordinates.forEach((lineSegment) => {
                const points = lineSegment.map(([ra, dec]) => {
                    const [x, y, z] = convertCelestialToCartesian(ra, dec, STAR_RADIUS);
                    return new THREE.Vector3(x, y, z);
                });
                shape.push(points);
            });
            return { id: feature.id, shape };
        });
    }, []);

    return (
        <group>
            {lines.map((constellation) => (
                <group key={constellation.id}>
                    {constellation.shape.map((points, index) => (
                        <group key={`${constellation.id}-${index}`}>
                            {/* Visual Line */}
                            <Line
                                points={points}
                                color={selectedConstellation === constellation.id ? "#7dd3fc" : "rgba(255, 255, 255, 0.2)"}
                                lineWidth={selectedConstellation === constellation.id ? 3 : 1}
                                transparent
                                opacity={selectedConstellation === constellation.id ? 0.8 : 0.3}
                            />
                            {/* Hitbox Line (Invisible but thicker) */}
                            <Line
                                points={points}
                                color="hotpink" // Debug color, but 0 opacity
                                lineWidth={20} // Much thicker for easy clicking
                                visible={true}
                                opacity={0}
                                transparent
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Clicked constellation (hitbox):', constellation.id);
                                    setSelectedConstellation(constellation.id);
                                }}
                                onPointerOver={(e) => {
                                    e.stopPropagation();
                                    document.body.style.cursor = 'pointer';
                                }}
                                onPointerOut={() => {
                                    document.body.style.cursor = 'auto';
                                }}
                            />
                        </group>
                    ))}
                </group>
            ))}
        </group>
    );
};
