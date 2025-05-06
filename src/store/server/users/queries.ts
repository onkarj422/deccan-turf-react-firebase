import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    User,
} from '@lib/firebase/firestore/users';

// Fetch all users
export const useFetchUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
});

// Fetch a single user by ID
export const useFetchUserById = (userId: string) => useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // Only fetch if userId is provided
});

// Create a new user
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate the users query to refetch data
        },
    });
};

// Update a user by ID
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updatedData }: { userId: string; updatedData: Partial<User> }) => updateUser(userId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate the users query to refetch data
        },
    });
};

// Delete a user by ID
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate the users query to refetch data
        },
    });
};
