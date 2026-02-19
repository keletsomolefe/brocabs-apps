import libphonenumber, { PhoneNumberFormat } from "google-libphonenumber";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

/**
 * Formats a phone number to E.164 format.
 * @param mobileNumber - The mobile number to format.
 * @returns The formatted phone number.
 */
export function formatPhoneNumber(mobileNumber: string): string {
  const parsedNumber = phoneUtil.parse(mobileNumber, "ZA");
  return phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
}
