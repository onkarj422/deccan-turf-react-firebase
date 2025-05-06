import { useBookingStore } from '@/store/local/bookingStore';
import {
    Box, Button, Divider, Text, Title, useMantineTheme,
} from '@mantine/core';
import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Navigate } from '@tanstack/react-router';
import { SlotSummaryCard } from '../components';

export default function Confirmation() {
    const theme = useMantineTheme();
    const { bookingDetails, turf, resetBooking } = useBookingStore();

    if (!bookingDetails || !turf) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    const handleBackToHome = () => {
        resetBooking();
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Box
                w="100%"
                className="flex flex-col items-center justify-center gap-4"
            >
                <IconRosetteDiscountCheckFilled
                    color={theme.colors.lime[6]}
                    size="240"
                />
                <Box
                    w="100%"
                    className="text-center"
                >
                    <Title size="h2">Payment Success!</Title>
                    <Text
                        size="lg"
                        fw={400}
                        c="gray.9"
                    >
                        Your booking has been confirmed
                    </Text>
                </Box>
                <SlotSummaryCard
                    bookingDetails={bookingDetails}
                    turf={turf}
                    cardBg="transparent"
                    showPrice={false}
                />
            </Box>
            <div className="flex-grow-1" />
            <Divider />
            <Button
                className="w-full"
                tt="uppercase"
                size="lg"
                variant="filled"
                color="lime"
                c="white"
                radius="md"
                onClick={handleBackToHome}
            >
                Back To Home
            </Button>
        </div>
    );
}
