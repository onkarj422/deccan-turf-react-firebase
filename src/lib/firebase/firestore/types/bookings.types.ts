export interface TimeBlock {
    startTime: string; // e.g. "06:00"
    endTime: string; // e.g. "18:00"
    price: number; // price per hour in ₹
  }

export type DayOfWeek =
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
    | 'All';

export interface PricingRule {
    days: DayOfWeek[]; // one or more days this rule applies to
    timeBlocks: TimeBlock[]; // multiple time-based pricing entries
  }

export type PricingRules = PricingRule[];
