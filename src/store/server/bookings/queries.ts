import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createBooking,
    getBookingById,
    updateBooking,
    deleteBooking,
    getAllBookings,
    Booking,
} from '@lib/firebase/firestore/bookings';
import { FirestoreQueryOptions } from '@/lib/firebase/firestore/query-builder';

// Fetch all bookings
export const useFetchBookings = (options: FirestoreQueryOptions = {}) => useQuery({
    queryKey: ['bookings', options],
    queryFn: () => getAllBookings(options),
});

// Fetch a single booking by ID
export const useFetchBookingById = (bookingId: string) => useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId, // Only fetch if bookingId is provided
});

// Create a new booking
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Invalidate the bookings query to refetch data
        },
    });
};

// Update a booking by ID
export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, updatedData }: { bookingId: string; updatedData: Partial<Booking> }) => updateBooking(bookingId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Invalidate the bookings query to refetch data
        },
    });
};

// Delete a booking by ID
export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bookingId: string) => deleteBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] }); // Invalidate the bookings query to refetch data
        },
    });
};
