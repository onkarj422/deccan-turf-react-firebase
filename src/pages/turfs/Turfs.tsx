import { TurfCard } from '@/components/TurfCard';
import { useFetchTurfs } from '@/store/server/turfs';
import {
    Button, Card, Divider, ScrollArea, SimpleGrid,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';

export default function Turfs() {
    const { data: turfs } = useFetchTurfs();
    const navigate = useNavigate();

    const handleAddTurf = () => {

    };

    const handleBookNow = (turfId: string) => {
        navigate({ to: `/app/book/${turfId}` });
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
                    scrollbarSize={2}
                    scrollbars="y"
                >
                    <SimpleGrid cols={1}>
                        {turfs?.map((turf) => (
                            <TurfCard
                                key={turf.turfId}
                                turf={turf}
                                onBookNow={handleBookNow}
                            />
                        ))}
                    </SimpleGrid>
                </ScrollArea>
                <div className="grow" />
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
            </Card>
        </div>
    );
}
