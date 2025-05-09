/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { Booking } from '@/lib/firebase/firestore/bookings';
import { Timestamp } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { BOOKING_STATUS } from '@/store/server/bookings/constants';
import {
    Box, Button, Group, LoadingOverlay, Stepper,
    Text,
    Title,
    useMantineTheme,
} from '@mantine/core';
import { SlotSummaryCard } from '@/pages/payment/components';
import UserSelect from '@/pages/users/components/UserSelect';
import { User } from '@/lib/firebase/firestore/users';
import { useCreateBooking } from '@/store/server/bookings';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import CreateUser from '@/pages/users/components/CreateUser';
import { getCurrentPricePerHour } from '@/pages/create-turf/utils';
import { getTotalSlotHours } from '@/lib/dates/utils';
import UserSummaryCard from '@/pages/users/components/UserSummaryCard';

interface AdminBookingProps {
    selectedTimeSlots: Dayjs[];
    turf: Turf;
    onBook?: (booking: Booking) => void;
}

export function AdminBooking({ selectedTimeSlots, turf, onBook }: AdminBookingProps) {
    const [active, setActive] = useState(0);
    const [currentUser, setCurrentUser] = useState<User>(null as unknown as User);

    const theme = useMantineTheme();
    const createBooking = useCreateBooking();

    const totalAmount = useMemo(() => {
        const pricingRules = turf && turf.pricingRules ? turf.pricingRules : [];
        const currentPricePerHour = getCurrentPricePerHour(pricingRules);
        const totalSlotHours = getTotalSlotHours(selectedTimeSlots);
        const total = currentPricePerHour * totalSlotHours;
        return total;
    }, [turf, selectedTimeSlots]);

    const slot = useMemo(() => {
        if (selectedTimeSlots.length === 0) {
            return {
                date: Timestamp.now(),
                times: [],
            };
        }
        return {
            date: Timestamp.fromDate(selectedTimeSlots[0].toDate()),
            times: selectedTimeSlots.map((time) => Timestamp.fromDate(time.toDate())),
        };
    }, [selectedTimeSlots]);

    const form = useForm<Booking>({
        mode: 'controlled',
        initialValues: {
            bookingId: '',
            userId: '',
            turfId: turf.turfId,
            slot,
            totalAmount,
            advancePaid: 0,
            paymentId: '',
            cancellationReason: '',
            status: BOOKING_STATUS.CONFIRMED,
            createdAt: Timestamp.now(),
        },

        validate: (values) => {
            if (active === 0) {
                return {
                    userId: values.userId ? null : 'User is required',
                };
            }

            if (active === 1) {
                return {
                    turfId: values.turfId ? null : 'Turf is required',
                    slot: values.slot.date ? null : 'Date is required',
                    slotTimes: values.slot.times.length > 0 ? null : 'Time slots are required',
                    totalAmount: values.totalAmount > 0 ? null : 'Total amount must be greater than 0',
                    status: values.status ? null : 'Status is required',
                };
            }

            return {};
        },
    });

    const nextStep = () => setActive((current) => {
        if (form.validate().hasErrors) {
            return current;
        }
        return current < 2 ? current + 1 : current;
    });

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleChangeUser = useCallback((user) => {
        form.setFieldValue('userId', user.userId);
        setCurrentUser(user);
    }, []);

    const handleClickBook = () => {
        form.setFieldValue('createdAt', Timestamp.now());
        if (form.validate().hasErrors) {
            return;
        }
        createBooking.mutate(form.getValues(), {
            onSuccess: () => {
                form.reset();
                setCurrentUser(null as unknown as User);
                nextStep();
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    icon: <IconExclamationCircle size={16} />,
                    message: error.message,
                    color: 'red',
                });
            },
        });
    };

    const handleClickDone = () => {
        setActive(0);
        form.reset();
        setCurrentUser(null as unknown as User);
        if (onBook && typeof onBook === 'function' && createBooking.data) {
            onBook(createBooking.data);
        }
    };

    const primaryActions = {
        0: (
            <Button
                key="next"
                c="white"
                bg="lime"
                size="md"
                tt="uppercase"
                onClick={nextStep}
                disabled={createBooking.isPending}
                loading={createBooking.isPending}
            >
                Next
            </Button>
        ),
        1: (
            <Button
                key="book"
                c="white"
                bg="lime"
                size="md"
                tt="uppercase"
                onClick={handleClickBook}
                disabled={createBooking.isPending}
                loading={createBooking.isPending}
            >
                Book
            </Button>
        ),
        2: (
            <Button
                key="done"
                c="white"
                bg="lime"
                size="md"
                tt="uppercase"
                onClick={handleClickDone}
            >
                Done
            </Button>
        ),
    };

    return (
        <Box
            h="calc(var(--drawer-height) - 5rem)"
            className="flex flex-col gap-4"
        >
            <LoadingOverlay
                visible={createBooking.isPending}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <Stepper
                active={active}
                className="flex-grow-1"
                color="lime"
            >
                <Stepper.Step label="Select User">
                    <UserSelect
                        value={form.values.userId}
                        onChange={handleChangeUser}
                    />
                    <Box className="text-center my-4">
                        <Text size="lg">OR</Text>
                    </Box>
                    <CreateUser onCreate={handleChangeUser} />
                </Stepper.Step>
                <Stepper.Step label="Review Booking">
                    <SlotSummaryCard
                        bookingDetails={{
                            slot: {
                                date: dayjs(form.values.slot.date.toDate()),
                                times: form.values.slot.times.map((time) => dayjs(time.toDate())),
                            },
                            totalAmount: form.values.totalAmount,
                        }}
                        turf={turf}
                        cardBg="var(--mantine-color-foreground)"
                    />
                    <UserSummaryCard user={currentUser} />
                </Stepper.Step>
                <Stepper.Completed>
                    <Box
                        w="100%"
                        h={320}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <IconRosetteDiscountCheckFilled
                            color={theme.colors.lime[6]}
                            size="180"
                        />
                        <Box
                            w="100%"
                            className="text-center"
                        >
                            <Title size="h3">Booking Confirmed!</Title>
                        </Box>
                    </Box>
                </Stepper.Completed>
            </Stepper>
            {active <= 1 && (<div className="flex-grow-1" />)}
            <Group
                justify="flex-end"
                mt="xl"
            >
                {(active !== 0 && active !== 2) && (
                    <Button
                        c="lime"
                        color="lime"
                        variant="outline"
                        size="md"
                        tt="uppercase"
                        onClick={prevStep}
                        disabled={createBooking.isPending}
                        loading={createBooking.isPending}
                    >
                        Back
                    </Button>
                )}
                {primaryActions[active]}
            </Group>
        </Box>
    );
}

AdminBooking.defaultProps = {
    onBook: () => {},
};
