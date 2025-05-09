import { DayOfWeek, PricingRule } from '@/lib/firebase/firestore/types/bookings.types';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

/* eslint-disable no-restricted-syntax */
export function validatePricingRules(pricingRules: PricingRule[]): string | null {
    const usedDays = new Set<string>();

    for (const rule of pricingRules) {
        const dayLabel = rule.days.includes('All')
            ? 'All Days'
            : rule.days.join(', ');

        // 1. Must have at least one day
        if (!rule.days || rule.days.length === 0) {
            return 'Please select at least one day for a pricing rule.';
        }

        // 2. "All" must not be combined with specific days
        if (rule.days.includes('All') && rule.days.length > 1) {
            return 'You can\'t combine "All Days" with specific weekdays. Please choose one or the other.';
        }

        // 3. No repeated days across rules (except "All")
        for (const day of rule.days) {
            if (day !== 'All' && usedDays.has(day)) {
                return `Day "${day}" has already been configured in another rule. Please avoid duplication.`;
            }
            if (day !== 'All') usedDays.add(day);
        }

        // 4. Must have at least one time block
        if (!rule.timeBlocks || rule.timeBlocks.length === 0) {
            return `Please define at least one time block for ${dayLabel}.`;
        }

        // 5. Validate each time block and check for overlaps
        const sortedBlocks = [...rule.timeBlocks].sort((a, b) => a.startTime.localeCompare(b.startTime));

        for (let i = 0; i < sortedBlocks.length; i += 1) {
            const block = sortedBlocks[i];
            const label = `${block.startTime}–${block.endTime}`;

            if (!block.startTime || !block.endTime || block.price == null) {
                return `A time block for ${dayLabel} is missing start time, end time, or price.`;
            }

            if (block.startTime === block.endTime) {
                return `The time block ${label} on ${dayLabel} has identical start and end time.`;
            }

            if (block.startTime > block.endTime) {
                return `The time block ${label} on ${dayLabel} has an invalid range. Start time must be before end time.`;
            }

            if (block.price <= 0) {
                return `The price for the time block ${label} on ${dayLabel} must be greater than 0.`;
            }

            // Check for overlap with next block
            if (i < sortedBlocks.length - 1) {
                const nextBlock = sortedBlocks[i + 1];
                if (block.endTime > nextBlock.startTime) {
                    return `The time blocks ${label} and ${nextBlock.startTime}–${nextBlock.endTime} on ${dayLabel} overlap. Please adjust them.`;
                }
            }
        }
    }

    return null; // ✅ All valid
}

export function getCurrentPricePerHour(pricingRules: PricingRule[]): number {
    const now = dayjs();
    const currentDay = now.format('dddd') as DayOfWeek; // e.g., "Monday"
    const currentTime = now.format('HH:mm');

    // Prioritize specific day matches, then fallback to "All"
    const applicableRules = [
        ...pricingRules.filter((rule) => rule.days.includes(currentDay)),
        ...pricingRules.filter((rule) => rule.days.includes('All')),
    ];

    for (const rule of applicableRules) {
        for (const block of rule.timeBlocks) {
            const start = dayjs(currentTime, 'HH:mm');
            const from = dayjs(block.startTime, 'HH:mm');
            const to = dayjs(block.endTime, 'HH:mm');

            if (start.isSameOrAfter(from) && start.isBefore(to)) {
                return block.price;
            }
        }
    }

    return 0; // No matching block found
}
