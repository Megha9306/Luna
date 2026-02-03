
export const calculateLST = (date: Date, longitude: number): number => {
    // 1. Calculate Julian Date (JD)
    // Formula from "Astronomical Algorithms" (Meeus) or similar standard texts.
    // JS Date.getTime() is ms since Jan 1 1970 UTC.
    // Julian Date for Jan 1 1970 is 2440587.5
    const JD = (date.getTime() / 86400000.0) + 2440587.5;

    // 2. Calculate Julian Centuries (T) since J2000.0
    // J2000.0 is JD 2451545.0
    const T = (JD - 2451545.0) / 36525.0;

    // 3. Calculate Greenwich Mean Sidereal Time (GMST) in degrees
    // Formula: GMST = 280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T^2 - T^3 / 38710000
    // We can use a simpler linear approximation for visual accuracy if needed, but the standard one is fine.
    // Note: (JD - 2451545) is basically days since J2000.
    const D = JD - 2451545.0;

    // Using the shorter linear form often sufficient for visual apps, but let's use the slightly better one:
    let GMST = 280.46061837 + 360.98564736629 * D + 0.000387933 * T * T - (T * T * T) / 38710000.0;

    // Normalize to 0-360
    GMST = GMST % 360;
    if (GMST < 0) GMST += 360;

    // 4. Calculate Local Sidereal Time (LST)
    // LST = GMST + Longitude (East is positive for this formula generally, but check conventions)
    // Usually: LST = GMST + Lon (if Lon is +East)
    let LST = GMST + longitude;

    // Normalize again
    LST = LST % 360;
    if (LST < 0) LST += 360;

    // Return in Radians for Three.js
    return LST * (Math.PI / 180);
};
