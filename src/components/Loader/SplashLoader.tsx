import { Box, Loader } from '@mantine/core';

export default function SplashLoader() {
    return (
        <div className="flex flex-col flex-nowrap grow">
            <Box
                h="100%"
                w="100%"
                style={{ backgroundImage: 'url(/deccan-turf-main.png)', position: 'relative' }}
                bgsz="cover"
                bgp="bottom"
                className="flex items-center justify-center grow"
            >
                {/* Overlay to darken the background */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.6)',
                        zIndex: 1,
                    }}
                />
                {/* Loader stays above the overlay */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <Loader
                        size="xl"
                        color="white"
                    />
                </div>
            </Box>
        </div>
    );
}
