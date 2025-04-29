import { useParams } from '@tanstack/react-router';
import { useFetchTurfs } from '@/store/server/turfs';
import { PageLoader } from '@/components/Loader';

export default function Booking() {
  const { turfId } = useParams({ strict: false });
  const { data: turfs, isLoading, isError, error } = useFetchTurfs();

  if (isLoading) return <PageLoader />;
  if (isError) return <div>Error: {error?.message}</div>;

  const turf = turfs?.find(t => t.turfId === turfId);

  if (!turf) return <div>Turf not found</div>;

  return (
    <div className='flex flex-col grow h-full w-full'>
      <div>Turf ID: {turf.turfId}</div>
      <div>Name: {turf.name}</div>
      <div>Description: {turf.description}</div>
      {/* Add more turf details as needed */}
    </div>
  );
}
