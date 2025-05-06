import { useMemo } from 'react';
import { useFetchUsers } from './queries';
import { createUsersHash } from './utils';

export const useUsersHash = () => {
    const usersResult = useFetchUsers();

    const usersHash = useMemo(() => createUsersHash(usersResult.data), [usersResult.data]);

    return {
        ...usersHash,
        ...usersResult,
    };
};
