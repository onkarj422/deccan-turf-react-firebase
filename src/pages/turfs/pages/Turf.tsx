import { useAuth } from '@/context';
import TurfSummary from '@/pages/create-turf/components/TurfSummary';
import { useDeleteTurf, useFetchTurfs } from '@/store/server/turfs';
import { Button, Group } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useMemo } from 'react';

export default function Turf() {
    const { turfId } = useParams({ strict: false });
    const { data: turfs } = useFetchTurfs();
    const { user } = useAuth();
    const navigate = useNavigate();
    const deleteTurf = useDeleteTurf();

    const turf = useMemo(() => turfs?.find((_turf) => _turf.turfId === turfId), [turfId, turfs]);

    const onClickEdit = () => {
        navigate({ to: `/app/edit-turf/${turfId}` });
    };

    const onClickDelete = () => {
        if (turf) {
            deleteTurf.mutateAsync(turf.turfId).then(() => {
                navigate({ to: '/app/turfs' });
            });
        }
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            {turf ? (
                <TurfSummary turf={turf} />
            ) : 'No turf found'}
            <div className="grow" />
            {user?.role === 'admin' && (
                <Group
                    align="center"
                    justify="end"
                    px="md"
                    py="md"
                >
                    <Button
                        variant="light"
                        c="red"
                        color="red"
                        size="md"
                        tt="uppercase"
                        onClick={onClickDelete}
                        leftSection={<IconTrash size={16} />}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="light"
                        c="lime"
                        color="lime"
                        size="md"
                        tt="uppercase"
                        onClick={onClickEdit}
                        leftSection={<IconPencil size={16} />}
                    >
                        Edit
                    </Button>
                </Group>
            )}
        </div>
    );
}
