import { useMemo } from 'react';
import * as THREE from 'three';
import starDataRaw from '../data/stars.json';
import { convertCelestialToCartesian } from '../utils/astronomy';

// Type definitions for the JSON data
interface StarFeature {
    geometry: {
        coordinates: [number, number]; // [RA, Dec]
    };
    properties: {
        mag: number;
        bv?: number; // Color index
    };
}

const STAR_RADIUS = 500;

export const StarField = () => {
    const geometry = useMemo(() => {
        // @ts-ignore
        const features = starDataRaw.features as StarFeature[];
        const positions: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];

        const color = new THREE.Color();

        features.forEach((feature) => {
            const [ra, dec] = feature.geometry.coordinates;
            const { mag, bv } = feature.properties;

            const [x, y, z] = convertCelestialToCartesian(ra, dec, STAR_RADIUS);
            positions.push(x, y, z);

            // Size based on magnitude (smaller mag = brighter/larger)
            // Visually tune this: max size ~15 for Sirius, min size ~1 for faint stars
            // Using inverse log scale or simple linear mapping for visual pop
            const size = Math.max(0.5, (6.5 - mag) * 1.5);
            sizes.push(size);

            // Color approximation from B-V index
            // Simple heuristic: < 0 is blue, > 1.5 is red
            let r = 1, g = 1, b = 1;
            if (bv !== undefined) {
                if (bv < 0.0) { r = 0.6; g = 0.6; b = 1.0; } // Blue-ish
                else if (bv < 0.5) { r = 0.9; g = 0.9; b = 1.0; } // White-blue
                else if (bv < 1.0) { r = 1.0; g = 1.0; b = 0.9; } // Yellow-white
                else { r = 1.0; g = 0.8; b = 0.6; } // Red-ish
            }
            color.setRGB(r, g, b);
            colors.push(color.r, color.g, color.b);
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        return geo;
    }, []);

    // Use a custom shader or modified PointsMaterial to handle per-point sizes if PointsMaterial size scalar isn't enough.
    // Standard PointsMaterial does not support attribute-based size out of the box without shader modification.
    // For simplicity and "real" look, we can use a ShaderMaterial.

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: new THREE.TextureLoader().load('/star_texture.png') }, // We don't have texture yet, assume circle
            },
            vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = size * ( 300.0 / -mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Circular particle
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4( vColor, 1.0 );
        }
      `,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
        });
    }, []);

    return (
        <points geometry={geometry} material={material} />
    );
};
