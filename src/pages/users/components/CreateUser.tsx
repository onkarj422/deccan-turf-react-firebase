/* eslint-disable react/jsx-props-no-spreading */
import { User } from '@/lib/firebase/firestore/users';
import { useCreateUser } from '@/store/server/users/queries';
import {
    Box, Button, NumberInput, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconExclamationCircle, IconPlus } from '@tabler/icons-react';
import { Timestamp } from 'firebase/firestore';

interface CreateUserProps {
    onCreate?: (user: User) => void;
}

export default function CreateUser({ onCreate }: CreateUserProps) {
    const createUser = useCreateUser();

    const form = useForm<User>({
        mode: 'uncontrolled',
        initialValues: {
            userId: '',
            name: '',
            email: '',
            phone: '',
            role: 'user',
            createdAt: Timestamp.now(),
        },
        validate: (values) => ({
            name: values.name ? null : 'Name is required',
            email: values.email ? null : 'Email is required',
            phone: values.phone ? null : 'Phone number is required',
        }),
    });

    const handleClickCreate = () => {
        if (form.validate().hasErrors) return;
        const userData = form.getValues();
        createUser.mutate(userData, {
            onSuccess: (user) => {
                form.reset();
                if (onCreate) {
                    onCreate(user);
                }
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

    return (
        <Box className="flex flex-col gap-4">
            <TextInput
                label="Name"
                placeholder="Enter name"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />
            <TextInput
                label="Email"
                placeholder="Enter email"
                type="email"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />
            <NumberInput
                label="Phone Number"
                placeholder="Enter phone number"
                type="tel"
                hideControls
                key={form.key('phone')}
                {...form.getInputProps('phone')}
            />
            <Button
                key="book"
                c="lime"
                color="lime"
                size="md"
                tt="uppercase"
                variant="outline"
                onClick={handleClickCreate}
                leftSection={<IconPlus size={20} />}
                disabled={createUser.isPending}
                loading={createUser.isPending}
            >
                Add New User
            </Button>
        </Box>
    );
}

CreateUser.defaultProps = {
    onCreate: () => { },
};
