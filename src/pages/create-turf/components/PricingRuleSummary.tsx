import type { PricingRule, DayOfWeek } from '@/lib/firebase/firestore/types/bookings.types';
import { Group, Text, Stack } from '@mantine/core';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { DAY_LABEL, DAY_ORDER } from '../constants';

dayjs.extend(customParseFormat);

function summarizeDays(days: DayOfWeek[]): string {
    if (days.includes('All')) return 'All Days';
    // Sort days by week order
    const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
    // Find consecutive ranges
    const indices = sorted.map((d) => DAY_ORDER.indexOf(d)).sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = 0;
    for (let i = 1; i <= indices.length; i += 1) {
        if (i === indices.length || indices[i] !== indices[i - 1] + 1) {
            if (start === i - 1) {
                ranges.push(DAY_LABEL[DAY_ORDER[indices[start]]]);
            } else {
                ranges.push(`${DAY_LABEL[DAY_ORDER[indices[start]]]} - ${DAY_LABEL[DAY_ORDER[indices[i - 1]]]}`);
            }
            start = i;
        }
    }
    return ranges.join(', ');
}

export default function PricingRuleSummary({ rule }: { rule: PricingRule }) {
    return (
        <Stack gap={2}>
            <Group
                gap={6}
                align="center"
            >
                <IconCalendar size={20} />
                <Text
                    size="md"
                    fw={500}
                >
                    {summarizeDays(rule.days)}
                </Text>
            </Group>
            {rule.timeBlocks.map((block) => {
                const { startTime } = block;
                const endTime = block.endTime === '23:59' ? '24:00' : block.endTime;
                const startTimeString = dayjs(startTime, 'HH:mm').format('h:mm A');
                const endTimeString = dayjs(endTime, 'HH:mm').format('h:mm A');
                return (
                    <Group
                        key={block.startTime + block.endTime}
                        gap={6}
                        justify="flex-start"
                        wrap="nowrap"
                    >
                        <IconClock size={20} />
                        <Text
                            size="lg"
                        >
                            {startTimeString}
                            {' '}
                            –
                            {' '}
                            {endTimeString}
                        </Text>
                        <Text
                            size="lg"
                            w={30}
                            mx="auto"
                        >
                            →
                        </Text>
                        <Text
                            size="lg"
                            w={80}
                            className="whitespace-nowrap"
                        >
                            {`₹ ${block.price}`}
                        </Text>
                    </Group>
                );
            })}
        </Stack>
    );
}
