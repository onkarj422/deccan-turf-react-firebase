import { Card } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { MouseEventHandler, useMemo } from 'react';

interface DayProps {
    date: string | Dayjs; // Optional selected date
    onClick?: MouseEventHandler<HTMLDivElement>; // Optional onClick handler
    selected?: boolean; // Optional selected date
    disabled?: boolean; // Optional disabled date
}

export default function Day({
    date, onClick, selected, disabled,
}: DayProps) {
    const dayjsDate = dayjs(date);
    const monthDay = dayjsDate.format('DD');
    const weekDay = dayjsDate.format('ddd');
    const bg = useMemo(() => {
        if (selected) return 'lime';
        if (disabled) return 'grey.6';
        return 'transparent';
    }, [selected, disabled]);
    return (
        <Card
            w="3.5rem"
            h="3.5rem"
            p="xs"
            withBorder
            bg={bg}
            variant="light" // Use outlined variant for better visibility
            className="flex items-center justify-center cursor-pointer"
            onClick={onClick}
        >
            <div className="text-xl/6 font-medium">{monthDay}</div>
            <div className="text-sm/4 font-medium uppercase">{weekDay}</div>
        </Card>
    );
}
