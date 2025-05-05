import { Title } from '@mantine/core';
import dayjs, { Dayjs } from 'dayjs';

interface MonthProps {
    selectedDate: string | Dayjs; // Optional selected date
    // onChangeDate?: (date: string | Dayjs) => void; // Optional onClick handler
}

export default function Month({
    selectedDate,
}: MonthProps) {
    return (
        <Title
            size="h2"
            c="lime.6"
        >
            {dayjs(selectedDate).format('MMM YYYY')}
        </Title>
    );
}
