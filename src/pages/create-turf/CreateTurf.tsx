/* eslint-disable react/jsx-props-no-spreading */
import { useAuth } from '@/context';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { useCreateTurf, useFetchTurfs, useUpdateTurf } from '@/store/server/turfs';
import {
    Box, Button, Group,
    LoadingOverlay,
    Stepper,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconExclamationCircle, IconPlus } from '@tabler/icons-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { GeoPoint, Timestamp } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useHeaderSlot } from '@/context/HeaderSlotContext';
import { validatePricingRules } from './utils';
import DetailsForm from './components/DetailsForm';
import PricingRulesForm from './components/PricingRulesForm';
import AdvancePercentageForm from './components/AdvancePercentageForm';
import TimingsForm from './components/TimingsForm';
import TurfSummary from './components/TurfSummary';
import { DEFAULT_ADVANCE_PERCENTAGE, DEFAULT_TIMINGS, FALLBACK_RULE } from './constants';

export default function CreateTurf() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const createTurf = useCreateTurf();
    const updateTurf = useUpdateTurf();
    const { turfId } = useParams({ strict: false });
    const { data: turfs, isLoading: isLoadingTurfs } = useFetchTurfs();
    const [active, setActive] = useState(0);
    const { setTitleSlot } = useHeaderSlot();

    const turf = useMemo(() => turfs?.find((_turf) => _turf.turfId === turfId), [turfId, turfs]);

    useEffect(() => {
        if (turfId) {
            setTitleSlot(
                <Title
                    ml="sm"
                    ta="center"
                    size="h3"
                >
                    Edit Turf
                </Title>,
            );
        }
        return () => {
            setTitleSlot(null);
        };
    }, [setTitleSlot, turfId]);

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
            advancePercentage: DEFAULT_ADVANCE_PERCENTAGE,
            images: ['/deccan-turf-banner2.png'],
            pricingRules: [FALLBACK_RULE],
            timings: DEFAULT_TIMINGS,
        },
        validate: (values) => ({
            name: values.name ? null : 'Name is required',
            location: (() => {
                if (!values.location.addressLine) return 'Address is required';
                if (!values.location.area) return 'Area is required';
                return null;
            })(),
            pricingRules: validatePricingRules(values.pricingRules),
        }),
    });

    useEffect(() => {
        if (turf?.turfId) {
            form.setValues(turf);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turf]);

    const nextStep = () => setActive((current) => {
        let hasErrors = false;
        if (current === 0) {
            // Validate name and location fields
            hasErrors = form.validateField('name').hasError
                || form.validateField('location.addressLine').hasError
                || form.validateField('location.area').hasError;
        } else if (current === 1) {
            hasErrors = form.validateField('pricingRules').hasError;
        } else if (current === 2) {
            hasErrors = form.validateField('advancePercentage').hasError;
        } else if (current === 3) {
            hasErrors = form.validateField('timings.open').hasError || form.validateField('timings.close').hasError;
        }
        if (hasErrors) {
            return current;
        }
        return current < 4 ? current + 1 : current;
    });

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleClickCreate = () => {
        if (form.validate().hasErrors) return;
        const turfData = form.getValues();
        if (turf?.turfId) {
            turfData.turfId = turf.turfId;
            updateTurf.mutate({
                turfId: turf.turfId,
                updatedData: turfData,
            }, {
                onSuccess: () => {
                    form.reset();
                    notifications.show({
                        title: 'Success',
                        message: 'Turf updated successfully',
                        color: 'green',
                        icon: <IconCircleCheck size={16} />,
                    });
                    navigate({ to: `/app/turf/${turf.turfId}` });
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message: error.message,
                        icon: <IconExclamationCircle size={16} />,
                        color: 'red',
                    });
                },
            });
            return;
        }
        turfData.createdAt = Timestamp.now();
        createTurf.mutate(turfData, {
            onSuccess: () => {
                form.reset();
                notifications.show({
                    title: 'Success',
                    message: 'Turf created successfully',
                    color: 'green',
                    icon: <IconCircleCheck size={16} />,
                });
                navigate({ to: '/app/turfs' });
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message: error.message,
                    icon: <IconExclamationCircle size={16} />,
                    color: 'red',
                });
            },
        });
    };

    const primaryActions = {
        next: (
            <Button
                key="next"
                c="white"
                bg="lime"
                size="md"
                tt="uppercase"
                onClick={nextStep}
            >
                Next
            </Button>
        ),
        back: (
            <Button
                key="back"
                c="lime"
                color="lime"
                variant="outline"
                size="md"
                tt="uppercase"
            >
                Back
            </Button>
        ),
        confirm: (
            <Button
                key="confirm"
                c="white"
                bg="lime"
                size="md"
                tt="uppercase"
                onClick={handleClickCreate}
                leftSection={<IconPlus size={20} />}
                disabled={createTurf.isPending}
                loading={createTurf.isPending}
            >
                Confirm
            </Button>
        ),
    };

    return (
        <div className="flex flex-col grow gap-1">
            <LoadingOverlay
                visible={createTurf.isPending || updateTurf.isPending || isLoadingTurfs}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <Box
                h="100%"
                className="flex flex-col gap-4"
            >
                <Stepper
                    active={active}
                    color="lime"
                    wrap={false}
                >
                    <Stepper.Step label="Turf Details">
                        <DetailsForm form={form} />
                    </Stepper.Step>
                    <Stepper.Step label="Pricing">
                        <PricingRulesForm form={form} />
                    </Stepper.Step>
                    <Stepper.Step label="Advance Payment">
                        <AdvancePercentageForm form={form} />
                    </Stepper.Step>
                    <Stepper.Step label="Timings">
                        <TimingsForm form={form} />
                    </Stepper.Step>
                    <Stepper.Completed>
                        <TurfSummary turf={form.values} />
                    </Stepper.Completed>
                </Stepper>
            </Box>
            <div className="grow" />
            <Group
                w="100%"
                px="sm"
                pt="sm"
                justify="end"
                align="center"
            >
                {active !== 0 && active !== 5 && (
                    <Button
                        c="lime"
                        color="lime"
                        variant="outline"
                        size="md"
                        tt="uppercase"
                        onClick={prevStep}
                    >
                        Back
                    </Button>
                )}
                {active === 4 ? primaryActions.confirm : primaryActions.next}
            </Group>
        </div>
    );
}
