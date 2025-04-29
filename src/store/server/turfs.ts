import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTurf,
  getTurfById,
  updateTurf,
  deleteTurf,
  getAllTurfs,
  Turf
} from '@lib/firebase/firestore/turfs';

// Fetch all turfs
export const useFetchTurfs = () => {
  return useQuery({
    queryKey: ['turfs'],
    queryFn: getAllTurfs,
  });
};

// Fetch a single turf by ID
export const useFetchTurfById = (turfId: string) => {
  return useQuery({
    queryKey: ['turf', turfId],
    queryFn: () => getTurfById(turfId),
    enabled: !!turfId, // Only fetch if turfId is provided
  });
};

// Create a new turf
export const useCreateTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTurf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] }); // Invalidate the turfs query to refetch data
    },
  });
};

// Update a turf by ID
export const useUpdateTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ turfId, updatedData }: { turfId: string; updatedData: Partial<Turf> }) =>
      updateTurf(turfId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] }); // Invalidate the turfs query to refetch data
    },
  });
};

// Delete a turf by ID
export const useDeleteTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (turfId: string) => deleteTurf(turfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] }); // Invalidate the turfs query to refetch data
    },
  });
};