/* eslint-disable react/no-array-index-key */
import type { DayOfWeek, PricingRule } from '@/lib/firebase/firestore/types/bookings.types';
import {
    Box, Button, Group, Text, Stack,
    Title,
} from '@mantine/core';
import { IconMoneybag, IconPlus } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import PricingRuleComponent from './PricingRule';
import { DEFAULT_TIME_BLOCK, FALLBACK_RULE } from '../constants';

interface PricingRulesEditorProps {
  value?: PricingRule[];
  onChange?: (rules: PricingRule[]) => void;
  error?: string | null;
}

export default function PricingRulesEditor({
    value = [FALLBACK_RULE],
    onChange,
    error,
}: PricingRulesEditorProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const prevLength = useRef(value.length);

    useEffect(() => {
        // Only reset editingIndex if rules were deleted or reset
        if (value.length < prevLength.current) {
            setEditingIndex(null);
        }
        prevLength.current = value.length;
    }, [value]);

    // Compute used days for each rule (excluding the current rule)
    const getDisabledDays = (currentIdx: number): DayOfWeek[] => {
        const used = new Set<DayOfWeek>();
        value.forEach((rule, idx) => {
            if (idx !== currentIdx) {
                rule.days.forEach((d) => {
                    if (d !== 'All') used.add(d);
                });
            }
        });
        return Array.from(used);
    };

    const handleRuleChange = (idx: number, rule: PricingRule) => {
        const newRules = value.map((r, i) => (i === idx ? rule : r));
        onChange?.(newRules);
    };

    const handleAddRule = () => {
        const newRules = [
            ...value,
            { days: [], timeBlocks: [DEFAULT_TIME_BLOCK] },
        ];
        onChange?.(newRules);
        setEditingIndex(newRules.length - 1); // new rule is editable
    };

    const handleDeleteRule = (idx: number) => {
        if (idx === 0) return; // Don't delete fallback
        const newRules = value.filter((_, i) => i !== idx);
        onChange?.(newRules);
        setEditingIndex(0); // fallback rule editable after delete
    };

    const handleEdit = (idx: number) => setEditingIndex(idx);
    const handleSave = (idx: number, updatedRule: PricingRule) => {
        handleRuleChange(idx, updatedRule);
        setEditingIndex(null);
    };

    return (
        <Box mb="md">
            <Group
                align="center"
                mb="md"
                gap={8}
            >
                <IconMoneybag size={20} />
                <Title
                    fw={400}
                    size="xl"
                >
                    Pricing Rules
                </Title>
            </Group>
            <Stack gap="xs">
                {value.map((rule, idx) => (
                    <PricingRuleComponent
                        key={idx}
                        rule={rule}
                        readonly={editingIndex !== idx}
                        editing={editingIndex === idx}
                        onChange={(r) => handleRuleChange(idx, r)}
                        onDelete={idx !== 0 ? () => handleDeleteRule(idx) : undefined}
                        onEdit={() => handleEdit(idx)}
                        onSave={(updatedRule) => handleSave(idx, updatedRule)}
                        disabledDays={getDisabledDays(idx)}
                    />
                ))}
            </Stack>
            {/* Hide Add Rule button if any rule has days: ['All'] */}
            { !value.some((rule) => rule.days.length === 7) && (
                <Group mt="md">
                    <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={handleAddRule}
                        variant="light"
                        tt="uppercase"
                    >
                        Add Rule
                    </Button>
                </Group>
            )}
            {error && (
                <Text
                    color="red"
                    mt="md"
                >
                    {error}
                </Text>
            )}
        </Box>
    );
}
