export const EFrequency = {
  Weekly: "weekly",
  Monthly: "monthly",
  Yearly: "yearly",
} as const;

export type TFrequency = (typeof EFrequency)[keyof typeof EFrequency];
