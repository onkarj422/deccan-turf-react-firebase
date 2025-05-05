import dayjs, { Dayjs } from 'dayjs';

export const createDateKey = (date: Date) => dayjs(date).format('YYYY-MM-DD');
export const createTimeslotKey = (date: Dayjs) => date.format('hh/A');
