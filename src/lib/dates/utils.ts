import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

export const createDateKey = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const createTimeslotKey = (date: Dayjs) => date.format('hh/A');

export const getStartAndEndHours = (slots: Dayjs[]) => {
    if (!slots || slots.length === 0) return [];
    const startSlot = slots[0];
    const endSlot = slots[slots.length - 1];
    const startHour = startSlot;
    const endHour = endSlot.add(1, 'hour');
    return [startHour, endHour];
};

export const getTotalSlotHours = (slots: Dayjs[]) => {
    if (!slots || slots.length === 0) return 0;
    const [startHour, endHour] = getStartAndEndHours(slots);
    return endHour.diff(startHour, 'hour');
};

export const getHourBlocks = (selectedDate: dayjs.Dayjs) => {
    const now = dayjs();
    return Array.from({ length: 25 }, (_, i) => selectedDate.startOf('day').add(i, 'hour'))
        .filter((block) => {
            // If selected date is today, filter out past hours
            if (selectedDate.isSame(now, 'day')) {
                return block.isSame(now, 'hour') || block.isAfter(now);
            }
            // For future dates, show all
            return true;
        });
};
