/* eslint-disable react/jsx-props-no-spreading */
import { Turf } from '@/lib/firebase/firestore/turfs';
import { Box, TextInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface DetailsFormProps {
    form: UseFormReturnType<Turf>;
}

export default function DetailsForm({ form }: DetailsFormProps) {
    return (
        <Box className="flex flex-col gap-4">
            <Title
                order={3}
                mb="md"
            >
                Enter Turf Details
            </Title>
            <TextInput
                label="Name"
                placeholder="Enter turf name"
                key={form.key('name')}
                size="md"
                {...form.getInputProps('name')}
            />
            <TextInput
                label="Address Line"
                placeholder="Enter address line"
                type="text"
                size="md"
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
                size="md"
                key={form.key('location.area')}
                value={form.values.location.area}
                onChange={(event) => {
                    form.setFieldValue('location.area', event.currentTarget.value);
                }}
            />
        </Box>
    );
}
