import { Turf } from '@/lib/firebase/firestore/turfs';
import { Box, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';

interface TurfTimingsProps {
    turf: Turf;
}

export default function TurfTimings({ turf }: TurfTimingsProps) {
    const { open } = turf.timings;
    const startTimeString = dayjs(open, 'HH:mm').format('h:mm A');
    const close = turf.timings.close === '23:59' ? '24:00' : turf.timings.close;
    const closeTimeString = dayjs(close, 'HH:mm').format('h:mm A');
    return (
        <Box>
            <Title
                size="lg"
                fw={400}
            >
                Timings:
                {' '}
                {startTimeString}
                {' '}
                –
                {' '}
                {closeTimeString}
            </Title>
        </Box>
    );
}
