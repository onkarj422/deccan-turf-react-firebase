import { useAuth } from '@/context';
import { useUpdateUser } from '@/store/server/users/queries';
import {
    Box, Button, Divider, NumberInput, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPhone } from '@tabler/icons-react';

interface UpdatePhoneProps {
    onUpdate?: () => void;
}

export default function UpdatePhone({ onUpdate }: UpdatePhoneProps) {
    const { user } = useAuth();
    const updateUser = useUpdateUser();
    const form = useForm({
        mode: 'controlled',
        initialValues: {
            phone: '',
        },
        validate: (values) => ({
            phone: (() => {
                const phone = values.phone.toString();
                if (phone.length < 10) return 'Phone number must be 10 digits';
                if (!/^\d+$/.test(phone)) return 'Phone number must contain only digits';
                return null;
            })(),
        }),
    });

    const onClickContinue = () => {
        if (form.validate().hasErrors) return;
        const values = form.getValues();
        const phone = values.phone.toString();
        updateUser.mutate(
            { userId: user?.userId, updatedData: { phone } },
            {
                onSuccess: () => {
                    form.reset();
                    if (onUpdate) {
                        onUpdate();
                    }
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message: error.message,
                        color: 'red',
                    });
                },
            },
        );
    };

    return (
        <Box
            w="100%"
            h={300}
            className="flex flex-col gap-2"
        >
            <Text
                size="lg"
                fw={500}
                className="text-center"
            >
                We need your phone number to continue booking.
            </Text>
            <Text
                className="text-center"
                c="dimmed"
            >
                Please enter you WhatsApp phone number
            </Text>
            <NumberInput
                placeholder="Enter your phone number"
                hideControls
                className="w-full"
                my="sm"
                size="md"
                required
                defaultValue={0}
                min={0}
                max={9999999999}
                step={1}
                value={form.values.phone}
                onChange={(value) => form.setFieldValue('phone', String(value))}
                error={form.errors.phone}
                leftSection={(
                    <IconPhone
                        size={16}
                        color="gray"
                    />
                )}
            />
            <div className="grow" />
            <Divider my="xs" />
            <Button
                className="w-full"
                variant="outline"
                color="lime"
                radius="md"
                tt="uppercase"
                onClick={onClickContinue}
                loading={updateUser.isPending}
                disabled={updateUser.isPending}
            >
                Continue Booking
            </Button>
        </Box>
    );
}

UpdatePhone.defaultProps = {
    onUpdate: () => { },
};
