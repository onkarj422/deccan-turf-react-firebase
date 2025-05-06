/* eslint-disable no-restricted-syntax */
import { User } from '@/lib/firebase/firestore/users';

export const createUsersHash = (users: User[] | undefined) => {
    if (!users || !users.length) {
        return {
            usersById: {},
        };
    }

    const usersById: Record<string, User> = {};

    for (const user of users) {
        usersById[user.userId] = user;
    }

    return {
        usersById,
    };
};
