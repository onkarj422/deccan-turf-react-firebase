import { ScrollArea, Group } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useMemo } from 'react';
import Day from './Day';

dayjs.extend(isSameOrBefore);

interface WeekProps {
    month: number; // dayjs month format (0-11)
    selectedDate: string | Dayjs; // Optional selected date
    onChangeDate: (date: string | dayjs.Dayjs) => void; // Optional onClick handler
}

export default function DaySlider({ month, onChangeDate, selectedDate }: WeekProps) {
    const today = dayjs();
    const currentMonth = today.month();
    const currentYear = today.year();
    // Start from today if month is current, else from 1st of given month
    const startDate = month === currentMonth
        ? today.startOf('day')
        : dayjs().year(currentYear).month(month).date(1);

    // Generate days for the given month only
    const days = useMemo(() => {
        const daysArray: dayjs.Dayjs[] = [];
        const endDate = startDate.endOf('month');
        let d = startDate;
        while (d.isSameOrBefore(endDate, 'day')) {
            daysArray.push(d);
            d = d.add(1, 'day');
        }
        return daysArray;
    }, [startDate]);

    return (
        <ScrollArea
            type="auto"
            scrollbarSize={0}
            scrollbars="x"
            style={{ width: '100%' }}
        >
            <Group
                wrap="nowrap"
                py="4"
                px="2"
                gap={8}
            >
                {days.map((d) => {
                    const isSelected = d.isSame(dayjs(selectedDate), 'day');
                    return (
                        <Day
                            key={d.valueOf()}
                            date={d}
                            onClick={() => onChangeDate(d)}
                            selected={isSelected}
                        />
                    );
                })}
            </Group>
        </ScrollArea>
    );
}
