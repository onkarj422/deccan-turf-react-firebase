import { useFetchTurfs } from '@/store/server/turfs';
import TurfCard from '@/components/TurfCard/TurfCard';
import { ErrorComponent, useNavigate } from '@tanstack/react-router';
import { PageLoader } from '@/components/Loader';

export default function Home() {
    const {
        data: turfs, isLoading, isError, error,
    } = useFetchTurfs();
    const navigate = useNavigate();

    if (isLoading) return <PageLoader />;
    // Handle error state
    if (isError) {
        return <ErrorComponent error={error} />;
    }

    const handleBookNow = (turfId: string) => {
        navigate({ to: `/app/book/${turfId}` });
    };

    return (
        <div className="flex flex-col flex-wrap grow p-3">
            {turfs?.map((turf) => (
                <TurfCard
                    key={turf.turfId}
                    name={turf.name}
                    description={turf.description}
                    pricePerHour={turf.pricePerHour}
                    image={turf.images[0]}
                    onBookNow={() => handleBookNow(turf.turfId)}
                />
            ))}
        </div>
    );
}
