import {
    Box, Divider, Group, Text,
} from '@mantine/core';
import { Dayjs } from 'dayjs';

interface TimeSlotSummaryProps {
    slots: Dayjs[]; // Date to be formatted
    showDate?: boolean; // Optional prop to show time
}

export default function TimeSlotSummary({ slots }: TimeSlotSummaryProps) {
    const slot = slots && slots.length > 0 && slots[0];

    return (
        <Box className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center flex-grow-1">
                <Text
                    size="xs"
                    tt="uppercase"
                    fw={300}
                >
                    Date
                </Text>
                <Text
                    size="lg"
                    fw={400}
                >
                    {slot
                        ? `${slot.format('dddd DD MMM')}`
                        : 'Not selected'}
                </Text>
            </div>
            <Divider />
            <Group
                gap={24}
                align="start"
                w="100%"
            >
                <div className="flex flex-col items-center justify-center flex-grow-1">
                    <Text
                        size="xs"
                        tt="uppercase"
                        fw={300}
                    >
                        Time
                    </Text>
                    <Text
                        size="lg"
                        fw={400}
                    >
                        {slot
                            ? `${slot.format('hh:mm A')}`
                            : 'Not selected'}
                    </Text>
                </div>
                <Divider
                    orientation="vertical"
                    mx="xs"
                    style={{ height: 32 }}
                />
                <div className="flex flex-col items-center flex-grow-1">
                    <Text
                        size="xs"
                        tt="uppercase"
                        fw={300}
                    >
                        Duration
                    </Text>
                    <Text
                        size="lg"
                        fw={400}
                    >
                        {slots && slots.length
                            ? `${slots.length} hour(s)`
                            : 'N/A'}
                    </Text>
                </div>
            </Group>
        </Box>
    );
}

TimeSlotSummary.defaultProps = {
    showDate: false,
};
