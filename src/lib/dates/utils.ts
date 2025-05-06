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
    return endHour.hour() - startHour.hour();
};
