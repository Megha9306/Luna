import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Background stars effect could go here, for now simple gradient or reusing StarField casually */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ zIndex: 1, textAlign: 'center' }}
            >
                <h1 style={{
                    fontSize: '6rem',
                    marginBottom: '0.5rem',
                    fontFamily: 'serif', // Or a custom font
                    background: 'linear-gradient(to right, #fff, #a5b4fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    LUNA
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: '#cbd5e1',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    lineHeight: '1.6'
                }}>
                    Explore the cosmos with the wave of your hand. <br />
                    A touchless 3D night sky simulation.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/simulation')}
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.5rem',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 0 20px rgba(255,255,255,0.3)'
                    }}
                >
                    Let's Go
                </motion.button>
            </motion.div>
        </div>
    );
};
