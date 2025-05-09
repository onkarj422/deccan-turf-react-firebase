/* eslint-disable react/jsx-props-no-spreading */
import { Turf } from '@/lib/firebase/firestore/turfs';
import { Box, Title } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';

interface TimingsFormProps {
    form: UseFormReturnType<Turf>;
}

export default function TimingsForm({ form }: TimingsFormProps) {
    return (
        <Box>
            <Title
                order={3}
                mb="md"
            >
                Enter Turf Timings
            </Title>
            <TimeInput
                label="Open Time"
                placeholder="Enter open time"
                type="time"
                key={form.key('timings.open')}
                value={form.values.timings.open}
                size="md"
                onChange={(event) => {
                    form.setFieldValue('timings.open', event.currentTarget.value);
                }}
                mb="md"
            />
            <TimeInput
                label="Close Time"
                placeholder="Enter close time"
                type="time"
                key={form.key('timings.close')}
                size="md"
                value={form.values.timings.close === '23:59' ? '00:00' : form.values.timings.close}
                onChange={(event) => {
                    const endTime = event.currentTarget.value;
                    if (endTime === '00:00') {
                        form.setFieldValue('timings.close', '23:59');
                    } else {
                        form.setFieldValue('timings.close', endTime);
                    }
                }}
            />
        </Box>
    );
}
