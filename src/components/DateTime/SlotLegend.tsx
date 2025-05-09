import { Box, Group, Text } from '@mantine/core';

interface SlotLegendProps {
    aviailableColor?: string;
    bookedColor?: string;
}

export default function SlotLegend({ aviailableColor = 'lime.2', bookedColor = 'gray.4' }: SlotLegendProps) {
    return (
        <Box className="flex justify-end">
            <Group
                mb={8}
                gap={16}
            >
                <Group
                    gap={4}
                    align="center"
                >
                    <Box
                        w={10}
                        h={10}
                        bg={aviailableColor}
                        style={{ borderRadius: '50%' }}
                    />
                    <Text size="xs">Available</Text>
                </Group>
                <Group
                    gap={4}
                    align="center"
                >
                    <Box
                        w={10}
                        h={10}
                        bg={bookedColor}
                        style={{ borderRadius: '50%' }}
                    />
                    <Text size="xs">Booked</Text>
                </Group>
            </Group>
        </Box>
    );
}

SlotLegend.defaultProps = {
    aviailableColor: 'lime.2',
    bookedColor: 'gray.4',
};
