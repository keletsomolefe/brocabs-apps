import { Locale } from "expo-localization";
import { AsYouType, CountryCode, parsePhoneNumberWithError } from "libphonenumber-js";

import { COUNTRY_CODES } from "./country-codes";

export const DEFAULT_COUNTRY_CODE = "+27";
export const DEFAULT_COUNTRY: CountryCode = "ZA";

export function getCountryCode(locales: Locale[]) {
  const locale = locales[0].regionCode;
  const countryCode = COUNTRY_CODES.find((country) => country.code === locale);
  return countryCode?.dial_code;
}

/**
 * Convert dial code to ISO country code
 * e.g., "+1" -> "US", "+44" -> "GB"
 */
export const getISOCountryCodeFromDialCode = (dialCode: string): CountryCode => {
  const country = COUNTRY_CODES.find((c) => c.dial_code === dialCode);
  return (country?.code || DEFAULT_COUNTRY) as CountryCode;
};

// Helper to parse phone number and extract components
export const parsePhone = (
  phoneNumber: string | undefined,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
) => {
  if (!phoneNumber) {
    return { countryCode: DEFAULT_COUNTRY_CODE, number: "", isValid: false, e164: "" };
  }

  try {
    // Parse with default country as fallback
    const parsed = parsePhoneNumberWithError(phoneNumber, defaultCountry);

    if (parsed && parsed.isValid()) {
      return {
        countryCode: `+${parsed.countryCallingCode}`,
        number: parsed.nationalNumber,
        isValid: true,
        e164: parsed.format("E.164"),
      };
    }
  } catch {
    // console.warn("Failed to parse phone number:", error);
  }

  // Fallback: try to extract by checking known prefixes
  const knownPrefixes = ["+1", "+27", "+44", "+92", "+91", "+86"];
  const prefix = knownPrefixes.find((p) => phoneNumber.startsWith(p));

  return {
    countryCode: prefix || DEFAULT_COUNTRY_CODE,
    number: prefix ? phoneNumber.replace(prefix, "") : phoneNumber,
    isValid: false,
    e164: phoneNumber,
  };
};

export const detectCountryCode = (text: string) => {
  if (!text) return null;

  if (text.startsWith("+")) {
    const asYouType = new AsYouType();
    asYouType.input(text);
    const callingCode = asYouType.getCallingCode();
    if (callingCode) {
      return `+${callingCode}`;
    }
  }

  return null;
};
