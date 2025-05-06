import DateSelect from '@/components/DateTime/DateSelect';
import VerticalTimeSlotSelect from '@/components/DateTime/VerticalTimeSlotSelect';
import { useHeaderSlot } from '@/context/HeaderSlotContext';
import { createDateKey } from '@/lib/dates/utils';
import { useBookingsFromTodayHash } from '@/store/server/bookings/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Turf } from '@/lib/firebase/firestore/turfs';
import TurfSelect from '../turfs/components/TurfSelect';

export default function Bookings() {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Dayjs[]>([]);
    const [selectedTurf, setSelectedTurf] = useState<Turf>();
    const { setHeaderSlot } = useHeaderSlot();
    const { bookingsByDateTimeslot } = useBookingsFromTodayHash(selectedTurf?.turfId || '');

    useEffect(() => {
        setHeaderSlot(
            <TurfSelect
                value={selectedTurf?.turfId || ''}
                onChange={setSelectedTurf}
            />,
        );
    }, [setHeaderSlot, selectedTurf, setSelectedTurf]);

    const renderBlockContent = (params) => {
        const { bookings } = params;
        const [booking] = bookings || [];
        if (booking) {
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{booking.userId}</span>
                    <span className="text-xs text-gray-500">{booking.turfId}</span>
                </div>
            );
        }
        return '';
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <DateSelect
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
            />
            <VerticalTimeSlotSelect
                selectedDate={selectedDate}
                selectedTimeSlots={selectedTimeSlots}
                onChange={setSelectedTimeSlots}
                unavailableTimeslots={bookingsByDateTimeslot[createDateKey(dayjs(selectedDate).toDate())]}
                renderBlockContent={renderBlockContent}
            />
        </div>
    );
}
