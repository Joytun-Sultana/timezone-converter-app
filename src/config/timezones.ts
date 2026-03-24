export const countryToIanaMap = {
  BD: ["Asia/Dhaka"],
  NO: ["Europe/Oslo"],
  US: [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",
  ],
  GB: ["Europe/London"],
  JP: ["Asia/Tokyo"],
} as const;

export type CountryCode = keyof typeof countryToIanaMap;
export type IanaTimezone = (typeof countryToIanaMap)[CountryCode][number] | "UTC";

export type CountryToIanaMap = typeof countryToIanaMap;
