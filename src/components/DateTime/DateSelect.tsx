import { ActionIcon, Card, Group } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { DateKey } from '@/store/server/bookings/types';
import DaySlider from './DaySlider';
import Month from './Month';

interface DateSelectProps {
    selectedDate: string | Dayjs; // Optional selected date
    onChangeDate: (date: Dayjs) => void; // Optional onClick handler
    unavailableDates?: Record<DateKey, boolean>; // Optional unavailable dates
}

export default function DateSelect({
    selectedDate,
    onChangeDate,
    unavailableDates,
}: DateSelectProps) {
    const [selectedDateInernal, setSelectedDateInternal] = useState<Dayjs>(dayjs(selectedDate));

    const handleNextMonth = () => {
        const currentMonth = dayjs().startOf('month');
        const maxMonth = currentMonth.add(3, 'month');
        const nextMonth = dayjs(selectedDateInernal).add(1, 'month');
        if (nextMonth.isAfter(maxMonth)) return; // Prevent going beyond 3 months ahead
        setSelectedDateInternal(nextMonth);
    };

    const handlePrevMonth = () => {
        const currentMonth = dayjs().startOf('month');
        const prevMonth = dayjs(selectedDateInernal).subtract(1, 'month');
        if (prevMonth.isBefore(currentMonth)) return; // Prevent going before current month
        setSelectedDateInternal(prevMonth);
    };

    return (
        <Card
            withBorder
            radius="md"
            mih={140}
            className="flex flex-col gap-4 p-2"
        >
            <Group
                align="center"
                justify="space-between"
                className="w-full"
            >
                <Month selectedDate={selectedDateInernal} />
                <Group
                    align="center"
                    gap="xs"
                >
                    <ActionIcon
                        onClick={handlePrevMonth}
                        color="lime.6"
                        size="md"
                    >
                        <IconChevronLeft
                            size="24"
                            color="white"
                        />
                    </ActionIcon>
                    <ActionIcon
                        onClick={handleNextMonth}
                        color="lime.6"
                        size="md"
                    >
                        <IconChevronRight
                            size="24"
                            color="white"
                        />
                    </ActionIcon>
                </Group>
            </Group>
            <DaySlider
                month={dayjs(selectedDateInernal).month()}
                onChangeDate={onChangeDate}
                selectedDate={selectedDate}
                unavailableDates={unavailableDates}
            />
        </Card>
    );
}

DateSelect.defaultProps = {
    unavailableDates: {}, // Default to empty object
};
