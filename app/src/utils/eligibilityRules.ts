/* Utilities related to eligibility rules */

// Participant most likely does not meet eligibility criteria if:
// - they select 'no' for the residential requirement OR
// - they select 'none of the above' for the categorical requirement
export function passesInitialEligibilityCheck(
  isResident: boolean,
  hasCategory: boolean
) {
  return isResident && hasCategory
}
