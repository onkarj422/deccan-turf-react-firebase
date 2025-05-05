import { useState } from 'react';
import {
    Group, ScrollArea, Box, Text,
} from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';

interface TimeSlotSelectProps {
  selectedDate: Dayjs | string; // Selected date
  onChange: (range: { start: Dayjs; end: Dayjs }) => void;
}

const BLOCK_WIDTH = 60;
const BLOCK_GAP = 8;

const getHourBlocks = (selectedDate: dayjs.Dayjs) => Array.from({ length: 25 }, (_, i) => selectedDate.startOf('day').add(i, 'hour'));

export default function TimeSlotSelect({
    selectedDate: _selectedDate,
    onChange,
}: TimeSlotSelectProps) {
    const selectedDate = dayjs(_selectedDate);
    const hourBlocks = getHourBlocks(selectedDate);
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

    const handleLimeBlockClick = (idx: number) => {
        if (!selection) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange({ start: hourBlocks[idx], end: hourBlocks[idx + 1] });
            }
            return;
        }
        // If clicked block is already in selection, reset to that block only
        if (idx >= selection.start && idx <= selection.end) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange({ start: hourBlocks[idx], end: hourBlocks[idx + 1] });
            }
            return;
        }
        // Select all blocks in between (inclusive)
        const newStart = Math.min(selection.start, idx);
        const newEnd = Math.max(selection.end, idx);
        setSelection({ start: newStart, end: newEnd });
        if (onChange) {
            onChange({ start: hourBlocks[newStart], end: hourBlocks[newEnd + 1] });
        }
    };

    const isBlockSelected = (idx: number) => {
        if (!selection) return false;
        return idx >= selection.start && idx <= selection.end;
    };

    return (
        <Box>
            {/* Legend for slot status aligned right */}
            <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                        <span style={{ fontSize: 12 }}>Available</span>
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
                        <span style={{ fontSize: 12 }}>Booked</span>
                    </Group>
                </Group>
            </Box>
            <ScrollArea
                type="auto"
                scrollbarSize={0}
                className="w-full mb-4"
            >
                {/* First row: centered with margin on both sides */}
                <Group
                    wrap="nowrap"
                    gap={BLOCK_GAP}
                    style={{
                        marginLeft: BLOCK_WIDTH / 2 + BLOCK_GAP / 2,
                        marginRight: BLOCK_WIDTH / 2 + BLOCK_GAP / 2,
                    }}
                    mb={10}
                >
                    {hourBlocks.slice(0, -1).map((h, idx) => (
                        <Box
                            key={`row1-${h.valueOf()}`}
                            w={BLOCK_WIDTH}
                            h={40}
                            bg={isBlockSelected(idx) ? 'lime' : 'lime.2'}
                            className="cursor-pointer"
                            onClick={() => handleLimeBlockClick(idx)}
                        />
                    ))}
                </Group>
                {/* Second row: shifted left by half a block, so blocks are under the gaps */}
                <Group
                    wrap="nowrap"
                    gap={BLOCK_GAP}
                >
                    {hourBlocks.map((h) => (
                        <Box
                            key={`row2-${h.valueOf()}`}
                            w={BLOCK_WIDTH}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="font-medium text-lg/6 uppercase">{h.format('hh')}</div>
                            <div
                                style={{ color: 'var(--mantine-color-gray-6)' }}
                                className="font-light text-sm/3 uppercase"
                            >
                                {h.format('a')}
                            </div>
                        </Box>
                    ))}
                </Group>
            </ScrollArea>
            {/* Show selected time range and duration */}
            {selection ? (
                <Box
                    mt={12}
                    className="text-center flex flex-row items-center justify-center gap-2"
                >
                    <Text size="md">
                        {hourBlocks[selection.start].format('h:mm A')}
                        {' '}
                        –
                        {' '}
                        {hourBlocks[selection.end + 1].format('h:mm A')}
                    </Text>
                    <Text
                        size="sm"
                        c="gray.6"
                    >
                        (
                        {selection.end - selection.start + 1}
                        {' '}
                        hour
                        {selection.end - selection.start + 1 > 1 ? 's' : ''}
                        )
                    </Text>
                </Box>
            ) : (
                <Box
                    mt={12}
                    className="text-center"
                    c="gray.6"
                >
                    Select a time slot
                </Box>
            )}
        </Box>
    );
}
