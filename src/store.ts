import { create } from 'zustand';

interface GestureState {
    isHandDetected: boolean;
    gesture: 'NONE' | 'PAN' | 'ZOOM';
    panDelta: { x: number; y: number }; // -1 to 1
    zoomFactor: number; // 1.0 is neutral

    // Luna/New Features
    inputMode: 'GESTURE' | 'MOUSE';
    searchQuery: string;
    selectedConstellation: string | null;
    targetCameraPosition: { x: number; y: number; z: number } | null;

    observerLocation: { lat: number; lon: number };
    observerDate: Date;

    setHandDetected: (detected: boolean) => void;
    setGesture: (gesture: 'NONE' | 'PAN' | 'ZOOM') => void;
    setPanDelta: (delta: { x: number; y: number }) => void;
    setZoomFactor: (factor: number) => void;

    setInputMode: (mode: 'GESTURE' | 'MOUSE') => void;
    setSearchQuery: (query: string) => void;
    setSelectedConstellation: (id: string | null) => void;
    setTargetCameraPosition: (pos: { x: number; y: number; z: number } | null) => void;

    setObserverLocation: (loc: { lat: number; lon: number }) => void;
    setObserverDate: (date: Date) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
    isHandDetected: false,
    gesture: 'NONE',
    panDelta: { x: 0, y: 0 },
    zoomFactor: 1.0,

    inputMode: 'GESTURE',
    searchQuery: '',
    selectedConstellation: null,
    targetCameraPosition: null,

    setHandDetected: (detected) => set({ isHandDetected: detected }),
    setGesture: (gesture) => set({ gesture }),
    setPanDelta: (delta) => set({ panDelta: delta }),
    setZoomFactor: (factor) => set({ zoomFactor: factor }),

    setInputMode: (mode) => set({ inputMode: mode }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedConstellation: (id) => set({ selectedConstellation: id }),
    setTargetCameraPosition: (pos) => set({ targetCameraPosition: pos }),

    // Observer State Actions
    observerLocation: { lat: 0, lon: 0 },
    observerDate: new Date(),
    setObserverLocation: (loc) => set({ observerLocation: loc }),
    setObserverDate: (date) => set({ observerDate: date }),
}));
