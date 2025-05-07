import { useMatches } from '@tanstack/react-router';

export const useRouteStaticData = () => {
    const matches = useMatches();
    const match = matches[matches.length - 1];
    return match?.staticData || {};
};
