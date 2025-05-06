import { Box, Group, Text } from '@mantine/core';

export default function SlotLegend() {
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
                        bg="lime.2"
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
                        bg="gray.4"
                        style={{ borderRadius: '50%' }}
                    />
                    <Text size="xs">Booked</Text>
                </Group>
            </Group>
        </Box>
    );
}
