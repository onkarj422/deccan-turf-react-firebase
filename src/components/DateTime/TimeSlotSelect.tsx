import { useState } from 'react';
import {
    Group, ScrollArea, Box, Text,
} from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { BookingByTimeslot } from '@/store/server/bookings/types';
import { createTimeslotKey } from '@/lib/dates/utils';
import TimeSlotRange from './TimeSlotRange';

interface TimeSlotSelectProps {
    selectedDate: Dayjs | string; // Selected date
    selectedTimeSlots: Dayjs[]; // Selected time slots
    onChange: (blocks: Dayjs[]) => void;
    unavailableTimeslots?: BookingByTimeslot,
}

const BLOCK_WIDTH = 60;
const BLOCK_GAP = 8;

const getHourBlocks = (selectedDate: dayjs.Dayjs) => Array.from({ length: 25 }, (_, i) => selectedDate.startOf('day').add(i, 'hour'));

export default function TimeSlotSelect({
    selectedDate: _selectedDate,
    selectedTimeSlots,
    onChange,
    unavailableTimeslots,
}: TimeSlotSelectProps) {
    const selectedDate = dayjs(_selectedDate);
    const hourBlocks = getHourBlocks(selectedDate);
    const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

    const isBlockSelected = (idx: number) => {
        if (!selection) return false;
        return idx >= selection.start && idx <= selection.end;
    };

    const isBlockUnavailable = (idx: number) => {
        if (!unavailableTimeslots) return false;
        const bookings = unavailableTimeslots[createTimeslotKey(hourBlocks[idx])];
        return bookings?.length > 0;
    };

    const handleBlockClick = (idx: number) => {
        if (isBlockUnavailable(idx)) return;

        if (!selection) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange([hourBlocks[idx]]);
            }
            return;
        }

        // If clicked block is already in selection, or before current start, reset to that block only
        if ((idx >= selection.start && idx <= selection.end) || idx < selection.start) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange([hourBlocks[idx]]);
            }
            return;
        }

        // If clicked block is after current end
        if (idx > selection.end) {
            // Check if all blocks between current end+1 and idx are available
            const hasUnavailable = Array.from({ length: idx - selection.end }, (_, i) => selection.end + 1 + i)
                .some((i) => isBlockUnavailable(i));
            if (hasUnavailable) {
                setSelection({ start: idx, end: idx });
                if (onChange) {
                    onChange([hourBlocks[idx]]);
                }
                return;
            }
            // Select all blocks from start to idx
            setSelection({ start: selection.start, end: idx });
            if (onChange) {
                onChange(hourBlocks.slice(selection.start, idx + 1));
            }
        }
    };

    const getBlockBg = (idx: number) => {
        if (isBlockUnavailable(idx)) {
            return 'gray.4';
        }
        return isBlockSelected(idx) ? 'lime' : 'lime.2';
    };

    return (
        <Box>
            {/* Legend for slot status aligned right */}
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
                            id={`block-${h.format('hh a')}`}
                            w={BLOCK_WIDTH}
                            h={40}
                            bg={getBlockBg(idx)}
                            className={`${isBlockUnavailable(idx) ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                            onClick={() => handleBlockClick(idx)}
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
                                {h.format('A')}
                            </div>
                        </Box>
                    ))}
                </Group>
            </ScrollArea>
            {/* Show selected time range and duration */}
            {selection ? (
                <Box className="flex flex-col items-center">
                    <TimeSlotRange
                        slots={selectedTimeSlots}
                    />
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

TimeSlotSelect.defaultProps = {
    unavailableTimeslots: {},
};
