export const GENDERS = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

export type Gender = (typeof GENDERS)[keyof typeof GENDERS];