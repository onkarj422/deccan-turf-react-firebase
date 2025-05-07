/* eslint-disable no-restricted-syntax */
import { User } from '@/lib/firebase/firestore/users';

export const createUsersHash = (users: User[] | undefined) => {
    const usersById: Record<string, User> = {};
    const usersByRole: Record<string, User[]> = {};

    if (users) {
        for (const user of users) {
            usersById[user.userId] = user;
            if (usersByRole[user.role]) {
                usersByRole[user.role].push(user);
            } else {
                usersByRole[user.role] = [user];
            }
        }
    }

    return {
        usersById,
        usersByRole,
    };
};
