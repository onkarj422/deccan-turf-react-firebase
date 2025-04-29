import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSlot,
  getSlotById,
  updateSlot,
  deleteSlot,
  getAllSlots,
  Slot
} from '@lib/firebase/firestore/slots';

// Fetch all slots
export const useFetchSlots = () => {
  return useQuery({
    queryKey: ['slots'],
    queryFn: getAllSlots,
  });
};

// Fetch a single slot by ID
export const useFetchSlotById = (slotId: string) => {
  return useQuery({
    queryKey: ['slot', slotId],
    queryFn: () => getSlotById(slotId),
    enabled: !!slotId, // Only fetch if slotId is provided
  });
};

// Create a new slot
export const useCreateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] }); // Invalidate the slots query to refetch data
    },
  });
};

// Update a slot by ID
export const useUpdateSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, updatedData }: { slotId: string; updatedData: Partial<Slot> }) =>
      updateSlot(slotId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] }); // Invalidate the slots query to refetch data
    },
  });
};

// Delete a slot by ID
export const useDeleteSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => deleteSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots'] }); // Invalidate the slots query to refetch data
    },
  });
};