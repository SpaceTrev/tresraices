import { Region, RegionDetectionMethod } from './types';

export function detectRegionFromPhone(phoneNumber: string): {
  region: Region | null;
  method: RegionDetectionMethod | null;
} {
  // Expect E.164 format: +523312345678 or 523312345678
  const cleaned = phoneNumber.replace(/\+/g, '');
  
  // Guadalajara area code: 33
  if (cleaned.startsWith('5233')) {
    return {
      region: 'guadalajara',
      method: 'area_code'
    };
  }
  
  // Colima area code: 312
  if (cleaned.startsWith('52312')) {
    return {
      region: 'colima',
      method: 'area_code'
    };
  }
  
  // No match - will ask user
  return {
    region: null,
    method: null
  };
}
