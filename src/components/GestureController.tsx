import { useEffect, useRef } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useGestureStore } from '../store';

export const GestureController = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { setHandDetected, setPanDelta, setZoomFactor, setGesture } = useGestureStore();
    const lastVideoTime = useRef(-1);

    useEffect(() => {
        const videoElement = videoRef.current;
        let handLandmarker: HandLandmarker | null = null;
        let animationFrameId: number;

        const init = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );

            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: '/models/hand_landmarker.task',
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numHands: 1,
            });

            startWebcam();
        };

        const startWebcam = async () => {
            if (!videoElement) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoElement.srcObject = stream;
                videoElement.addEventListener('loadeddata', predictWebcam);
            } catch (err) {
                console.error('Error accessing webcam:', err);
            }
        };

        const predictWebcam = () => {
            if (!handLandmarker || !videoElement) return;

            const startTimeMs = performance.now();
            if (videoElement.currentTime !== lastVideoTime.current) {
                lastVideoTime.current = videoElement.currentTime;

                const results = handLandmarker.detectForVideo(videoElement, startTimeMs);

                if (results.landmarks && results.landmarks.length > 0) {
                    setHandDetected(true);
                    const landmarks = results.landmarks[0];

                    // Logic:
                    // Pan: Based on Wrist position (landmarks[0]) vs center (0.5, 0.5)
                    // Coordinates are normalized [0,1].
                    // X increases right, Y increases down.

                    const wrist = landmarks[0];
                    const x = wrist.x;
                    const y = wrist.y;

                    // Deadzone of 0.1 around center
                    const deadzone = 0.1;
                    let dx = 0;
                    let dy = 0;

                    if (Math.abs(x - 0.5) > deadzone) {
                        dx = (x - 0.5) * 2; // -1 to 1 approx
                    }
                    if (Math.abs(y - 0.5) > deadzone) {
                        dy = (y - 0.5) * 2;
                    }

                    setPanDelta({ x: dx, y: dy });

                    // Zoom: Pinch detection (Thumb tip [4] vs Index tip [8])
                    const thumbTip = landmarks[4];
                    const indexTip = landmarks[8];
                    const distance = Math.sqrt(
                        Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
                    );

                    // Pinch threshold
                    const isPinch = distance < 0.05;

                    if (isPinch) {
                        setGesture('ZOOM');
                        // In zoom mode, maybe use Y position for zoom level?
                        // Or usually, pinch and drag relies on relative movement.
                        // For simplicity, let's map Y position to Zoom factor if pinching.
                        // Up = Zoom In, Down = Zoom Out
                        const zoom = 1.0 + (0.5 - y) * 2; // 0.5 center = 1.0. Up (0) = 2.0. Down (1) = 0.0
                        setZoomFactor(Math.max(0.1, Math.min(zoom, 3.0)));
                    } else {
                        setGesture('PAN');
                    }

                } else {
                    setHandDetected(false);
                    setGesture('NONE');
                    setPanDelta({ x: 0, y: 0 });
                }
            }

            animationFrameId = requestAnimationFrame(predictWebcam);
        };

        init();

        return () => {
            if (videoElement && videoElement.srcObject) {
                (videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, [setGesture, setHandDetected, setPanDelta, setZoomFactor]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '200px',
                height: '150px',
                borderRadius: '10px',
                transform: 'scaleX(-1)', // Mirror for user feeling
                zIndex: 10,
                opacity: 0.7,
                objectFit: 'cover'
            }}
        />
    );
};
