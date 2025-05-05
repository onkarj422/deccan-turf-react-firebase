import { getStartAndEndHours, getTotalSlotHours } from '@/lib/dates/utils';
import { Box, Text } from '@mantine/core';
import { Dayjs } from 'dayjs';

interface TimeSlotRangeProps {
    slots: Dayjs[];
    size?: 'sm' | 'md' | 'lg';
}

export default function TimeSlotRange({
    slots, size,
}: TimeSlotRangeProps) {
    const duration = getTotalSlotHours(slots);
    const [startHour, endHour] = getStartAndEndHours(slots);
    return (
        <Box
            className="flex flex-row items-center gap-2"
        >
            <Text size={size}>
                {startHour && startHour.format('h:mm A')}
                {' '}
                –
                {' '}
                {endHour && endHour.format('h:mm A')}
            </Text>
            <Text
                size="sm"
                c="dimmed"
            >
                (
                { duration > 1 ? `${duration} hours` : `${duration} hour` }
                )
            </Text>
        </Box>
    );
}

TimeSlotRange.defaultProps = {
    size: 'md',
};
