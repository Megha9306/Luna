
import React, { useEffect, useState } from 'react';
import { useGestureStore } from '../../store';
import { Clock, MapPin, Search, Loader2 } from 'lucide-react';
import { searchLocation, type GeocodingResult } from '../../utils/geocoding';

export const LocationTimePanel = () => {
    const {
        observerLocation,
        setObserverLocation,
        observerDate,
        setObserverDate
    } = useGestureStore();

    // Format date for datetime-local input: YYYY-MM-DDThh:mm
    const formatDate = (date: Date) => {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const [dateStr, setDateStr] = useState(formatDate(observerDate));

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [locationName, setLocationName] = useState('Remote Location');

    // Sync local state when store changes externally (optional, but good practice)
    useEffect(() => {
        setDateStr(formatDate(observerDate));
    }, [observerDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateStr(e.target.value);
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            setObserverDate(newDate);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setShowResults(false);
        const results = await searchLocation(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
    };

    const selectLocation = (result: GeocodingResult) => {
        setObserverLocation({ lat: result.lat, lon: result.lon });
        setLocationName(result.name);
        setSearchQuery('');
        setShowResults(false);
    };

    const handleSetCurrent = () => {
        const now = new Date();
        setObserverDate(now);
        setIsSearching(true);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setObserverLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });

                    // Reverse geocode could go here to get name, but for now just set descriptive text
                    setLocationName("Current Location");
                    setIsSearching(false);
                },
                (err) => {
                    console.error(err);
                    setIsSearching(false);
                }
            );
        } else {
            setIsSearching(false);
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
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10,
            width: '260px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Observer Settings</h3>
                <button
                    onClick={handleSetCurrent}
                    disabled={isSearching}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        opacity: isSearching ? 0.5 : 1
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
                        padding: '6px',
                        borderRadius: '4px',
                        width: '100%',
                        fontSize: '12px',
                        fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Location Search */}
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <MapPin size={14} color="#aaa" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search city (e.g. Nokha)"
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                padding: '6px 6px 6px 28px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        disabled={isSearching}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: 'rgba(20, 20, 20, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        zIndex: 20,
                        maxHeight: '150px',
                        overflowY: 'auto'
                    }}>
                        {searchResults.map((res, idx) => (
                            <div
                                key={idx}
                                onClick={() => selectLocation(res)}
                                style={{
                                    padding: '6px 8px',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    borderBottom: idx < searchResults.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ fontWeight: 600 }}>{res.name}</div>
                                <div style={{ opacity: 0.6, fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.display_name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{locationName}</span>
                <span style={{ fontFamily: 'monospace' }}>
                    {observerLocation.lat.toFixed(2)}°, {observerLocation.lon.toFixed(2)}°
                </span>
            </div>
        </div>
    );
};
