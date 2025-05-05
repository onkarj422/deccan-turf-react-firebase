import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

export const createDateKey = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const createTimeslotKey = (date: Dayjs) => date.format('hh/A');

export const getTotalSlotHours = (slots: Dayjs[]) => {
    if (!slots || slots.length === 0) return 0;
    const start = slots[0];
    const end = slots[slots.length - 1];
    if (start.isSame(end)) return 1;
    return end.diff(start, 'hour');
};

export const getTotalSlotHoursByRange = (start: Dayjs, end: Dayjs) => {
    if (!start || !end) return 0;
    if (start.isSame(end)) return 1;
    return end.diff(start, 'hour');
};

export const getStartAndEndHours = (slots: Dayjs[]) => {
    if (!slots || slots.length === 0) return [];
    const [startHour] = slots;
    const end = slots[slots.length - 1];
    const endHour = end.isSame(startHour) ? end.add(1, 'hour') : end;
    return [startHour, endHour];
};
