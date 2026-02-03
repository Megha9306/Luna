export const convertCelestialToCartesian = (raDegrees: number, decDegrees: number, radius: number) => {
    // Three.js convention: Y is up.
    // We map Dec to Y-axis (latitude).
    // We map RA to X/Z plane (longitude).

    // Standard spherical (ISO):
    // x = r * sin(phi) * cos(theta)
    // y = r * sin(phi) * sin(theta) // This would be typical Z in math, but let's swap for Y-up
    // z = r * cos(phi)

    // Astronomy:
    // Dec is angle from equator -> Y axis component is r * sin(Dec)
    // RA is angle around Y axis.

    const radDec = decDegrees * (Math.PI / 180);
    const radRA = raDegrees * (Math.PI / 180);

    const y = radius * Math.sin(radDec);
    const x = radius * Math.cos(radDec) * Math.cos(radRA); // or sin
    const z = radius * Math.cos(radDec) * Math.sin(radRA); // or cos

    // We might need to invert z to match right-handed system or flip RA direction
    // RA increases to the East.

    return [x, y, z] as [number, number, number];
};
