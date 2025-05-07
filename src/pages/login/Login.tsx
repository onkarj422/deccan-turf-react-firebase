import GoogleLogo from '@assets/web_dark_rd_ctn.svg?react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from '@tanstack/react-router';
import {
    Box, Card, Text, Title,
    useMantineTheme,
} from '@mantine/core';
import { IconBallFootball, IconCricket, IconPlayFootball } from '@tabler/icons-react';
import { SplashLoader } from '@/components/Loader';

export default function Login() {
    const {
        loginWithGoogle, loginPending, loading, user,
    } = useAuth();
    const theme = useMantineTheme();

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
    };

    if (loginPending || loading) {
        return <SplashLoader />;
    }

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col flex-nowrap grow">
            <Box
                h="70%"
                w="100%"
                style={{ backgroundImage: 'url(/deccan-turf-main.png)' }}
                bgsz="cover"
                bgp="bottom"
                className="grow"
            />
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                h="40%"
                className="text-center flex flex-col items-center jusitfy-center gap-6"
            >
                <Box
                    h="100%"
                    w="100%"
                    className="flex flex-col items-center justify-center gap-4"
                >
                    <Box
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <Title
                            size="h1"
                            tt="uppercase"
                            style={{
                                textShadow: 'var(--mantine-color-lime-6) 2px 5px',
                            }}
                            fw={700}
                        >
                            Deccan Turfs
                        </Title>
                        <Box className="flex gap-2">
                            <IconPlayFootball
                                color={theme.colors.lime[6]}
                                size={60}
                            />
                            <IconBallFootball
                                color={theme.colors.lime[6]}
                                size={60}
                            />
                            <IconCricket
                                color={theme.colors.lime[6]}
                                size={60}
                            />
                        </Box>
                    </Box>
                    <Box className="flex flex-col items-center gap-1">
                        <Text c="dimmed">Please login to continue</Text>
                        <GoogleLogo
                            onClick={handleGoogleLogin}
                            className="cursor-pointer"
                        />
                    </Box>
                </Box>
            </Card>
        </div>
    );
}
