import { ScrollArea, Group } from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);
import Day from "./Day";
import { useMemo } from "react";

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
    const startDate =
        month === currentMonth
            ? today.startOf("day")
            : dayjs().year(currentYear).month(month).date(1);

    // Generate days for the given month only
    const days = useMemo(() => {
        const days: dayjs.Dayjs[] = [];
        const endDate = startDate.endOf("month");
        let d = startDate;
        while (d.isSameOrBefore(endDate, "day")) {
            days.push(d);
            d = d.add(1, "day");
        }
        return days;
    }, [month, selectedDate])

    return (
        <ScrollArea type="auto" scrollbarSize={0} scrollbars="x" style={{ width: "100%" }}>
            <Group wrap="nowrap" py='4' px='2' gap={8}>
                {days.map((d, idx) => {
                    const isSelected = d.isSame(dayjs(selectedDate), "day");
                    return (
                        <Day
                            key={d.format("YYYY-MM-DD") + idx}
                            date={d}
                            onClick={() => onChangeDate(d)}
                            selected={isSelected}
                        />
                    )
                })}
            </Group>
        </ScrollArea>
    );
}