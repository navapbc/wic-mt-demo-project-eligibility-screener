import { passesInitialEligibilityCheck } from '../../src/utils/eligibilityRules'

/**
 * Begin tests
 */

// Test passesInitialEligibilityCheck()
describe('Initial Eligibility Check', () => {
  const combinations = [
    ['residency and categorical requirements are both met', true, true, true],
    ['residency is met, but categorical is not', true, false, false],
    ['categorical is met, but residency is not', false, true, false],
    ['neither residency nor categorical is met', false, false, false],
  ]

  it.each(combinations)(
    'should correctly handle if %s',
    (description, isResident, hasCategory, expectedOutcome) => {
      const outcome = passesInitialEligibilityCheck(
        isResident as boolean,
        hasCategory as boolean
      )
      expect(outcome).toBe(expectedOutcome)
    }
  )
})
