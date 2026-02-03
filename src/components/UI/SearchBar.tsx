import { Search } from 'lucide-react';
import { useState } from 'react';
import { useGestureStore } from '../../store';
import constellationsRaw from '../../data/constellations.json';
import { constellationNames } from '../../data/constellationNames';

export const SearchBar = () => {
    const { setSelectedConstellation } = useGestureStore();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);

        if (val.length > 1) {
            const lowerVal = val.toLowerCase();
            // @ts-ignore
            const features = constellationsRaw.features;

            // Filter by ID match OR Name match
            const filtered = features.filter((f: any) => {
                const id = f.id;
                const name = constellationNames[id] || "";
                return id.toLowerCase().includes(lowerVal) || name.toLowerCase().includes(lowerVal);
            }).slice(0, 5);

            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const handleSelect = (constellation: any) => {
        console.log('Selected:', constellation.id);
        setSelectedConstellation(constellation.id);
        setQuery('');
        setResults([]);
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: '300px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <Search size={18} color="white" style={{ marginRight: '8px' }} />
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search constellations..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        outline: 'none',
                        width: '100%',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {results.length > 0 && (
                <div style={{
                    marginTop: '8px',
                    background: 'rgba(0,0,0,0.8)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    {results.map((res) => {
                        const name = constellationNames[res.id] || res.id;
                        return (
                            <div
                                key={res.id}
                                onClick={() => handleSelect(res)}
                                style={{
                                    padding: '10px 16px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{name}</span>
                                <span style={{ opacity: 0.5, fontSize: '0.8em' }}>{res.id}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
