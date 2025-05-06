import { Card, SimpleGrid } from '@mantine/core';
import ActionCard from '@/components/ActionCard/ActionCard';
import { useNavigate } from '@tanstack/react-router';
import { DASHBOARD_SERVICES } from './constants';

export default function Dashboard() {
    const navigate = useNavigate();
    const handleOnClick = (service: { title: string; icon: React.ElementType, routeTo: string }) => {
        navigate({ to: service.routeTo });
    };
    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                h="100%"
            >
                <SimpleGrid
                    cols={2}
                >
                    {DASHBOARD_SERVICES.map((service) => (
                        <ActionCard
                            key={service.title}
                            title={service.title}
                            icon={service.icon}
                            onClick={() => handleOnClick(service)}
                        />
                    ))}
                </SimpleGrid>
            </Card>
        </div>
    );
}
