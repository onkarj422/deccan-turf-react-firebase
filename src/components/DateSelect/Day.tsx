import { Card } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';
import { MouseEventHandler } from 'react';

interface DayProps {
    date: string | Dayjs; // Optional selected date
    onClick?: MouseEventHandler<HTMLDivElement>; // Optional onClick handler
    selected?: boolean; // Optional selected date
}

export default function Day({ date, onClick, selected }: DayProps) {
    const dayjsDate = dayjs(date);
    const monthDay = dayjsDate.format('DD');
    const weekDay = dayjsDate.format('ddd');
    return (
        <Card
            w="4rem"
            h="4rem"
            p="xs"
            withBorder
            bg={selected ? 'lime' : 'transparent'}
            variant="light" // Use outlined variant for better visibility
            className="flex items-center justify-center cursor-pointer"
            onClick={onClick}
        >
            <div className="text-xl/6 font-medium">{monthDay}</div>
            <div className="text-sm/4 font-medium uppercase">{weekDay}</div>
        </Card>
    );
}
