/* eslint-disable react/jsx-props-no-spreading */
import { Turf } from '@/lib/firebase/firestore/turfs';
import { Box, ScrollArea, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import PricingRulesEditor from './PricingRulesEditor';

interface PricingRulesFormProps {
    form: UseFormReturnType<Turf>;
}

export default function PricingRulesForm({ form }: PricingRulesFormProps) {
    return (
        <Box>
            <Title
                order={3}
                mb="md"
            >
                Create Pricing Rules
            </Title>
            <ScrollArea
                type="auto"
                scrollbars="y"
                h={680}
            >

                <PricingRulesEditor
                    value={form.values.pricingRules}
                    onChange={(rules) => form.setFieldValue('pricingRules', rules)}
                    error={typeof form.errors.pricingRules === 'string' ? form.errors.pricingRules : null}
                />
            </ScrollArea>
        </Box>
    );
}
