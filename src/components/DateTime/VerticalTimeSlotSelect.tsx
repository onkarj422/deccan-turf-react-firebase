import { useState } from 'react';
import {
    Group, ScrollArea, Box, Divider,
} from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { BookingByTimeslot } from '@/store/server/bookings/types';
import { createTimeslotKey } from '@/lib/dates/utils';
import { Booking } from '@/lib/firebase/firestore/bookings';
import TimeSlotRange from './TimeSlotRange';
import SlotLegend from './SlotLegend';

interface VerticalTimeSlotSelectProps {
    selectedDate: Dayjs | string;
    selectedTimeSlots: Dayjs[];
    onChange: (blocks: Dayjs[]) => void;
    unavailableTimeslots?: BookingByTimeslot,
    /**
     * Optional render prop for customizing block content (Vue-like slot)
     */
    renderBlockContent?: (params: {
        hour: Dayjs,
        idx: number,
        isSelected: boolean,
        isUnavailable: boolean,
        bookings: Booking[],
    }) => React.ReactNode;

    unavailableColor?: string;
    allowUnvailableClick?: boolean;
    onClickUnavailableBlock?: (hour: Dayjs, bookings: Booking[]) => void;
}

const BLOCK_HEIGHT = 60;
const BLOCK_GAP = 8;
const LABEL_WIDTH = 60;

const getHourBlocks = (selectedDate: dayjs.Dayjs) => Array.from({ length: 25 }, (_, i) => selectedDate.startOf('day').add(i, 'hour'));

export default function VerticalTimeSlotSelect({
    selectedDate: _selectedDate,
    selectedTimeSlots,
    onChange,
    unavailableTimeslots,
    renderBlockContent,
    onClickUnavailableBlock = () => {},
    unavailableColor = 'gray.4',
    allowUnvailableClick = false,
}: VerticalTimeSlotSelectProps) {
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
        if (isBlockUnavailable(idx)) {
            const hour = hourBlocks[idx];
            const bookings = unavailableTimeslots && unavailableTimeslots[createTimeslotKey(hour)];
            onClickUnavailableBlock(hour, bookings || []);
            return;
        }

        if (!selection) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange([hourBlocks[idx]]);
            }
            return;
        }

        if ((idx >= selection.start && idx <= selection.end) || idx < selection.start) {
            setSelection({ start: idx, end: idx });
            if (onChange) {
                onChange([hourBlocks[idx]]);
            }
            return;
        }

        if (idx > selection.end) {
            const hasUnavailable = Array.from({ length: idx - selection.end }, (_, i) => selection.end + 1 + i)
                .some((i) => isBlockUnavailable(i));
            if (hasUnavailable) {
                setSelection({ start: idx, end: idx });
                if (onChange) {
                    onChange([hourBlocks[idx]]);
                }
                return;
            }
            setSelection({ start: selection.start, end: idx });
            if (onChange) {
                onChange(hourBlocks.slice(selection.start, idx + 1));
            }
        }
    };

    const getBlockBg = (idx: number) => {
        if (isBlockUnavailable(idx)) {
            return unavailableColor;
        }
        return isBlockSelected(idx) ? 'lime' : 'lime.2';
    };

    return (
        <Box
            className="flex flex-col flex-grow-1"
            mih={0}
        >
            {/* Legend for slot status aligned right */}
            <SlotLegend />
            <ScrollArea
                type="auto"
                scrollbarSize={6}
                className="w-full flex-grow-1"
                mb="xs"
            >
                <Group gap={0}>
                    <Group
                        gap={BLOCK_GAP}
                        w={LABEL_WIDTH}
                    >
                        {/* Time labels */}
                        {hourBlocks.map((h) => (
                            <Box
                                key={`label-${h.valueOf()}`}
                                h={BLOCK_HEIGHT}
                                w={LABEL_WIDTH}
                                className="flex items-center justify-center"
                            >
                                <Box>
                                    <span className="font-medium text-base/6 uppercase">{h.format('hh')}</span>
                                    <span
                                        style={{ color: 'var(--mantine-color-gray-6)' }}
                                        className="font-light text-xs/3 uppercase ml-1"
                                    >
                                        {h.format('A')}
                                    </span>
                                </Box>
                            </Box>
                        ))}
                    </Group>
                    {/* Divider */}
                    <Divider
                        orientation="vertical"
                    />
                    {/* Slot blocks */}
                    <Group
                        align="flex-end"
                        gap={BLOCK_GAP}
                        className="grow"
                        w="min-content"
                        px="md"
                    >
                        {hourBlocks.slice(0, -1).map((h, idx) => {
                            const unavailable = isBlockUnavailable(idx);
                            const selected = isBlockSelected(idx);
                            return (
                                <Box
                                    key={`block-${h.valueOf()}`}
                                    h={BLOCK_HEIGHT}
                                    bg={getBlockBg(idx)}
                                    w="100%"
                                    className={`${
                                        ((unavailable && !allowUnvailableClick && !renderBlockContent))
                                            ? 'cursor-not-allowed pointer-events-none'
                                            : 'cursor-pointer'
                                    }`}
                                    onClick={() => handleBlockClick(idx)}
                                >
                                    {renderBlockContent ? renderBlockContent({
                                        hour: h,
                                        idx,
                                        isSelected: selected,
                                        isUnavailable: unavailable,
                                        bookings: unavailableTimeslots ? unavailableTimeslots[createTimeslotKey(h)] : [],
                                    }) : null}
                                </Box>
                            );
                        })}
                    </Group>
                </Group>
            </ScrollArea>
            {/* Show selected time range and duration */}
            {selection && (
                <Box className="flex flex-col items-center">
                    <TimeSlotRange slots={selectedTimeSlots} />
                </Box>
            )}
        </Box>
    );
}

VerticalTimeSlotSelect.defaultProps = {
    unavailableTimeslots: {},
    renderBlockContent: () => '',
    unavailableColor: 'gray.4',
    allowUnvailableClick: false,
    onClickUnavailableBlock: () => {},
};
