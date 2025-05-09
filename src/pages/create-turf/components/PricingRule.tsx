/* eslint-disable react/no-array-index-key */
import type { DayOfWeek, TimeBlock, PricingRule } from '@/lib/firebase/firestore/types/bookings.types';
import {
    Box, Card, Checkbox, Group, Text, NumberInput, Button, Divider,
    Space,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import {
    IconPencil, IconTrash, IconCheck, IconX, IconPlus,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { DAYS } from '../constants';

interface PricingRuleProps {
  rule: PricingRule;
  readonly?: boolean;
  onChange?: (rule: PricingRule) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onSave?: (rule: PricingRule) => void;
  editing?: boolean;
  disabledDays?: DayOfWeek[];
}

export default function PricingRule({
    rule,
    onDelete,
    onEdit,
    onSave,
    editing = false,
    disabledDays = [],
}: PricingRuleProps) {
    const [localRule, setLocalRule] = useState<PricingRule>(rule);

    useEffect(() => {
        setLocalRule(rule);
    }, [rule]);

    const isFallback = rule.days.includes('All');

    const handleDayChange = (days: DayOfWeek[]) => {
        setLocalRule({ ...localRule, days });
    };

    const handleTimeBlockChange = (idx: number, block: Partial<TimeBlock>) => {
        const newBlocks = localRule.timeBlocks.map((tb, i) => (i === idx ? { ...tb, ...block } : tb));
        setLocalRule({ ...localRule, timeBlocks: newBlocks });
    };

    const handleAddTimeBlock = () => {
        setLocalRule({
            ...localRule,
            timeBlocks: [
                ...localRule.timeBlocks,
                { startTime: '06:00', endTime: '12:00', price: 0 },
            ],
        });
    };

    const handleRemoveTimeBlock = (idx: number) => {
        const newBlocks = localRule.timeBlocks.filter((_, i) => i !== idx);
        setLocalRule({ ...localRule, timeBlocks: newBlocks });
    };

    const handlePriceChange = (idx: number, price: number) => {
        handleTimeBlockChange(idx, { price });
    };

    const handleTimeChange = (idx: number, field: 'startTime' | 'endTime', value: string) => {
        handleTimeBlockChange(idx, { [field]: value });
    };

    // Utility: check if time blocks cover the full day (00:00 to 00:00) with no gaps
    function isFullDayCovered(blocks: TimeBlock[]): boolean {
        if (!blocks.length) return false;
        const sorted = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime));
        if (sorted[0].startTime !== '00:00') return false;
        for (let i = 1; i < sorted.length; i += 1) {
            if (sorted[i - 1].endTime !== sorted[i].startTime) return false;
        }
        // Last block must end at 00:00 (next day)
        return sorted[sorted.length - 1].endTime === '00:00';
    }

    // Fallback rule: only price editable
    if (isFallback) {
        return (
            <Card
                withBorder
                py="xs"
                bg="var(--mantine-color-foreground)"
            >
                <Group
                    justify="space-between"
                    align="center"
                >
                    <Text
                        fw={600}
                        size="md"
                    >
                        Default Pricing
                    </Text>
                    <Group>
                        {!editing && (
                            <IconPencil
                                onClick={onEdit}
                                size={20}
                            />
                        )}
                    </Group>
                </Group>
                <Divider my="xs" />
                <Group
                    mt="xs"
                    align="center"
                    wrap="nowrap"
                >
                    <Text>All Days</Text>
                    <Group gap={4}>
                        <Text>{ localRule.timeBlocks[0].startTime }</Text>
                        <Text>-</Text>
                        <Text>{ localRule.timeBlocks[0].endTime }</Text>
                    </Group>
                    <div className="grow" />
                    <NumberInput
                        value={localRule.timeBlocks[0]?.price || 0}
                        onChange={(val) => {
                            handlePriceChange(0, Number(val));
                        }}
                        min={0}
                        step={50}
                        disabled={!editing}
                        maw={100}
                        miw={90}
                        rightSection={<Text size="sm">₹</Text>}
                    />
                </Group>
                {editing && (
                    <Group
                        mt="xs"
                        justify="end"
                    >
                        <Button
                            leftSection={<IconCheck size={16} />}
                            color="lime"
                            c="lime"
                            variant="light"
                            onClick={() => onSave?.(localRule)}
                            size="xs"
                            tt="uppercase"
                            disabled={!localRule.days || localRule.days.length === 0 || localRule.timeBlocks[0].price <= 0}
                        >
                            Save
                        </Button>
                    </Group>
                )}
            </Card>
        );
    }

    return (
        <Card
            withBorder
            py="xs"
            bg="var(--mantine-color-foreground)"
        >
            <Group
                justify="space-between"
                align="center"
            >
                <Text
                    fw={600}
                    size="md"
                >
                    Pricing Rule
                </Text>
                <Group>
                    {onDelete && !isFallback && !editing && (
                        <IconX
                            onClick={onDelete}
                            size={20}
                        />
                    )}
                    {!editing && (
                        <IconPencil
                            onClick={onEdit}
                            size={20}
                        />
                    )}
                </Group>
            </Group>
            <Divider my="xs" />
            <Box>
                <Group mb="xs">
                    <Text fw={500}>Days:</Text>
                    <Checkbox.Group
                        value={localRule.days}
                        onChange={handleDayChange}
                    >
                        <Group>
                            {DAYS.map((d) => (
                                <Checkbox
                                    color="lime"
                                    key={d.value}
                                    value={d.value}
                                    label={d.label}
                                    disabled={!editing || disabledDays.includes(d.value)}
                                />
                            ))}
                        </Group>
                    </Checkbox.Group>
                </Group>
                <Text
                    fw={500}
                    mb={4}
                >
                    Time:
                </Text>
                <Box>
                    {localRule.timeBlocks.map((block, idx) => (
                        <Group
                            key={idx}
                            mb={4}
                            align="center"
                            gap={0}
                            wrap="nowrap"
                        >
                            <TimeInput
                                value={block.startTime}
                                type="time"
                                onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                                disabled={!editing}
                                w="100%"
                            />
                            <Text mx="xs">-</Text>
                            <TimeInput
                                value={block.endTime === '23:59' ? '00:00' : block.endTime}
                                type="time"
                                onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value === '00:00' ? '23:59' : e.target.value)}
                                disabled={!editing}
                                w="100%"
                            />
                            <Space w={10} />
                            <NumberInput
                                value={block.price}
                                onChange={(val) => handlePriceChange(idx, Number(val))}
                                min={0}
                                step={50}
                                disabled={!editing}
                                w="100%"
                                rightSection={<Text size="sm">₹</Text>}
                            />
                            {!editing ? null : (
                                localRule.timeBlocks.length > 1 && (
                                    <Box miw={30}>
                                        <IconX
                                            className="ml-2"
                                            size="16"
                                            onClick={() => handleRemoveTimeBlock(idx)}
                                            aria-label="Remove Block"
                                        />
                                    </Box>
                                )
                            )}
                        </Group>
                    ))}
                    {!editing ? null : (
                        <Button
                            leftSection={<IconPlus size={16} />}
                            variant="subtle"
                            size="xs"
                            mt={4}
                            onClick={handleAddTimeBlock}
                            disabled={isFullDayCovered(localRule.timeBlocks)}
                        >
                            Add Time Block
                        </Button>
                    )}
                </Box>
            </Box>
            {editing && (
                <Group
                    justify="end"
                >
                    {onDelete && (
                        <Button
                            leftSection={<IconTrash size={16} />}
                            variant="light"
                            c="red"
                            color="red"
                            onClick={onDelete}
                            tt="uppercase"
                            size="xs"
                        >
                            Remove
                        </Button>
                    )}
                    <Button
                        leftSection={<IconCheck size={16} />}
                        c="lime"
                        color="lime"
                        variant="light"
                        onClick={() => onSave?.(localRule)}
                        size="xs"
                        tt="uppercase"
                        disabled={!localRule.days || localRule.days.length === 0}
                    >
                        Save
                    </Button>
                </Group>
            )}
        </Card>
    );
}
