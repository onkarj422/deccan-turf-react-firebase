import { ActionIcon, Card, Group } from "@mantine/core";
import Month from "./Month";
import dayjs, { Dayjs } from "dayjs";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import DaySlider from "./DaySlider";
import { useState } from "react";

interface DateSelectProps {
    selectedDate: string | Dayjs; // Optional selected date
    onChangeDate: (date: string | Dayjs) => void; // Optional onClick handler
}

export default function DateSelect({
    selectedDate,
    onChangeDate
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
        <Card withBorder radius="md" className="flex flex-col gap-4 p-2">
            <Group align="center" justify="space-between" className="w-full">
                <Month selectedDate={selectedDateInernal} />
                <Group align="center" gap="xs">
                    <ActionIcon onClick={handlePrevMonth} color="lime.6" size="lg">
                        <IconChevronLeft
                            size="30"
                            color={'white'}
                        />
                    </ActionIcon>
                    <ActionIcon onClick={handleNextMonth} color="lime.6" size="lg">
                        <IconChevronRight
                            size="30"
                            color={'white'}
                        />
                    </ActionIcon>
                </Group>
            </Group>
            <DaySlider month={dayjs(selectedDateInernal).month()} onChangeDate={onChangeDate} selectedDate={selectedDate} />
        </Card>
    )
}