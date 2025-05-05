import { Dayjs } from 'dayjs';

export type BookingDetails = {
    slot: {
        date: Dayjs;
        times: Dayjs[];
    };
    totalAmount: number;
};
