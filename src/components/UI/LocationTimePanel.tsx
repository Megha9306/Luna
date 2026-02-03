
import React, { useEffect, useState } from 'react';
import { useGestureStore } from '../../store';
import { Clock } from 'lucide-react';

export const LocationTimePanel = () => {
    const {
        observerLocation,
        setObserverLocation,
        observerDate,
        setObserverDate
    } = useGestureStore();

    // Local state for inputs to avoid excessive store updates during typing
    const [lat, setLat] = useState(observerLocation.lat.toString());
    const [lon, setLon] = useState(observerLocation.lon.toString());

    // Format date for datetime-local input: YYYY-MM-DDThh:mm
    const formatDate = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const [dateStr, setDateStr] = useState(formatDate(observerDate));

    // Sync local state when store changes externally (optional, but good practice)
    useEffect(() => {
        setLat(observerLocation.lat.toString());
        setLon(observerLocation.lon.toString());
    }, [observerLocation]);

    useEffect(() => {
        setDateStr(formatDate(observerDate));
    }, [observerDate]);

    const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLat(e.target.value);
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            setObserverLocation({ ...observerLocation, lat: val });
        }
    };

    const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLon(e.target.value);
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            setObserverLocation({ ...observerLocation, lon: val });
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateStr(e.target.value);
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            setObserverDate(newDate);
        }
    };

    const handleSetCurrent = () => {
        const now = new Date();
        setObserverDate(now);
        // Browser geolocation could be added here
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setObserverLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            });
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            padding: '15px',
            borderRadius: '12px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10,
            width: '240px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Observer Settings</h3>
                <button
                    onClick={handleSetCurrent}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer'
                    }}
                    title="Set to Current Location & Time"
                >
                    Current
                </button>
            </div>

            {/* Date/Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} color="#aaa" />
                <input
                    type="datetime-local"
                    value={dateStr}
                    onChange={handleDateChange}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '4px',
                        borderRadius: '4px',
                        width: '100%',
                        fontSize: '12px'
                    }}
                />
            </div>

            {/* Location */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: '#aaa', display: 'block', marginBottom: '2px' }}>Latitude</label>
                    <input
                        type="number"
                        value={lat}
                        onChange={handleLatChange}
                        placeholder="Lat"
                        step="0.1"
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: '#aaa', display: 'block', marginBottom: '2px' }}>Longitude</label>
                    <input
                        type="number"
                        value={lon}
                        onChange={handleLonChange}
                        placeholder="Lon"
                        step="0.1"
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}
                    />
                </div>
            </div>

            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>
                Lat: {observerLocation.lat.toFixed(2)}°, Lon: {observerLocation.lon.toFixed(2)}°
            </div>
        </div>
    );
};
