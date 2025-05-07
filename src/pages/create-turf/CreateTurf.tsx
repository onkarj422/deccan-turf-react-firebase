/* eslint-disable react/jsx-props-no-spreading */
import { useAuth } from '@/context';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { useCreateTurf } from '@/store/server/turfs';
import {
    Box, Button, NumberInput, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { GeoPoint, Timestamp } from 'firebase/firestore';

export default function CreateTurf() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const createTurf = useCreateTurf();

    const form = useForm<Turf>({
        mode: 'controlled',
        initialValues: {
            turfId: '',
            name: '',
            description: '',
            location: {
                addressLine: '',
                area: '',
                city: 'Sambhaji Nagar (Aurangabad)',
                pincode: '431001',
                state: 'Maharashtra',
                country: 'India',
                coordinates: new GeoPoint(0, 0),
            },
            amenities: ['Football', 'Cricket'],
            createdBy: user.userId,
            createdAt: Timestamp.now(),
            pricePerHour: 0,
            advanceAmount: 0,
            images: ['/deccan-turf-banner2.png'],
            timings: {
                open: '08:00',
                close: '22:00',
            },
        },
        validate: (values) => ({
            name: values.name ? null : 'Name is required',
            location: (() => {
                if (!values.location.addressLine) return 'Address is required';
                if (!values.location.area) return 'Area is required';
                return null;
            })(),
            pricePerHour: values.pricePerHour > 0 ? null : 'Price is required',
            advanceAmount: values.advanceAmount > 0 ? null : 'Advance amount is required',
        }),
    });

    const handleClickCreate = () => {
        if (form.validate().hasErrors) return;
        const turfData = form.getValues();
        turfData.createdAt = Timestamp.now();
        createTurf.mutate(turfData, {
            onSuccess: () => {
                form.reset();
                navigate({ to: '/app/turfs' });
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message: error.message,
                    color: 'red',
                });
            },
        });
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Box
                h="100%"
                className="flex flex-col gap-4"
            >
                <TextInput
                    label="Name"
                    placeholder="Enter turf name"
                    key={form.key('name')}
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="Address Line"
                    placeholder="Enter address line"
                    type="text"
                    key={form.key('location.addressLine')}
                    value={form.values.location.addressLine}
                    onChange={(event) => {
                        form.setFieldValue('location.addressLine', event.currentTarget.value);
                    }}
                />
                <TextInput
                    label="Area"
                    placeholder="Enter area"
                    type="text"
                    key={form.key('location.area')}
                    value={form.values.location.area}
                    onChange={(event) => {
                        form.setFieldValue('location.area', event.currentTarget.value);
                    }}
                />
                <NumberInput
                    label="Price"
                    placeholder="Enter price per hour"
                    hideControls
                    key={form.key('pricePerHour')}
                    {...form.getInputProps('pricePerHour')}
                />
                <NumberInput
                    label="Advance"
                    placeholder="Enter min. advance amount"
                    hideControls
                    key={form.key('advanceAmount')}
                    {...form.getInputProps('advanceAmount')}
                />
                <div className="grow" />
                <Button
                    key="book"
                    c="lime"
                    color="lime"
                    size="md"
                    tt="uppercase"
                    variant="outline"
                    onClick={handleClickCreate}
                    leftSection={<IconPlus size={20} />}
                    disabled={createTurf.isPending}
                    loading={createTurf.isPending}
                >
                    Create New Turf
                </Button>
            </Box>
        </div>
    );
}
