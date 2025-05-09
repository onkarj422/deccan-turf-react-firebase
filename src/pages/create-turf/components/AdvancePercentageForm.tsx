/* eslint-disable react/jsx-props-no-spreading */
import { Turf } from '@/lib/firebase/firestore/turfs';
import { Box, NumberInput, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

interface AdvancePercentageFormProps {
    form: UseFormReturnType<Turf>;
}

export default function AdvancePercentageForm({ form }: AdvancePercentageFormProps) {
    return (
        <Box>
            <Title
                order={3}
                mb="md"
            >
                Enter the % of advance amount to be paid by the customer
            </Title>
            <NumberInput
                label="Advance Amount Percentage"
                placeholder="Enter advance amount percentage"
                hideControls
                max={100}
                min={1}
                key={form.key('advancePercentage')}
                size="md"
                {...form.getInputProps('advancePercentage')}
            />
        </Box>
    );
}
