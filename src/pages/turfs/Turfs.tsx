import { TurfCard } from '@/components/TurfCard';
import { useAuth } from '@/context';
import { useFetchTurfs } from '@/store/server/turfs';
import {
    Box,
    Button, Card, Divider, ScrollArea, SimpleGrid,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

export default function Turfs() {
    const { user } = useAuth();
    const { data: turfs } = useFetchTurfs();
    const navigate = useNavigate();

    const handleAddTurf = () => {
        navigate({ to: '/app/create-turf' });
    };

    const handleBookNow = (turfId: string) => {
        navigate({ to: `/app/book/${turfId}` });
    };

    const handleOnClickCard = (turf) => {
        navigate({ to: `/app/turf/${turf.turfId}` });
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                h="100%"
            >
                <ScrollArea
                    type="auto"
                    scrollbarSize={0}
                    scrollbars="y"
                >
                    <SimpleGrid cols={1}>
                        {turfs?.map((turf) => (
                            <TurfCard
                                key={turf.turfId}
                                turf={turf}
                                onBookNow={handleBookNow}
                                onClick={handleOnClickCard}
                            />
                        ))}
                    </SimpleGrid>
                </ScrollArea>
                <div className="grow" />
                {user?.role === 'admin' && (
                    <Box
                        px="md"
                        pt="md"
                        className="flex justify-center items-center"
                    >
                        <Divider />
                        <Button
                            tt="uppercase"
                            size="md"
                            bg="lime"
                            c="white"
                            leftSection={(
                                <IconPlus
                                    size={24}
                                    color="white"
                                />
                            )}
                            onClick={handleAddTurf}
                        >
                            Create New
                        </Button>
                    </Box>
                )}
            </Card>
        </div>
    );
}
