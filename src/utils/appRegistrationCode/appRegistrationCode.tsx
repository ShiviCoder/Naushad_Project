/**
 * App Registration Code Configuration
 * This file contains the app registration code that is sent with every user registration
 */

export const APP_REGISTRATION_CODE = 'NAUMOINSOD';

/**
 * Get the app registration code
 * @returns {string} The app registration code
 */
export const getAppRegistrationCode = (): string => {
  console.log('📱 Fetching App Registration Code:', APP_REGISTRATION_CODE);
  return APP_REGISTRATION_CODE;
};

/**
 * Validate if a code matches the app registration code
 * @param code - The code to validate
 * @returns {boolean} True if the code matches
 */
export const validateAppRegistrationCode = (code: string): boolean => {
  return code === APP_REGISTRATION_CODE;
};

export default {
  APP_REGISTRATION_CODE,
  getAppRegistrationCode,
  validateAppRegistrationCode,
};
