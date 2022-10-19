import { EligibilityData } from '@src/types'
import { isValidEligibility } from '@utils/dataValidation'

export const invalidEligibilityCombinations = [
  ['no values are set', '', [], '', []],
  ['residential is not set', '', ['anything'], 'anything', ['anything']],
  ['categorical is not set', 'anything', [], 'anything', ['anything']],
  ['previouslyEnrolled is not set', 'anything', ['anything'], '', ['anything']],
  ['adjunctive is not set', 'anything', ['anything'], 'anything', []],
]

it.each(invalidEligibilityCombinations)(
  'should be invalid if %s',
  (description, residential, categorical, previouslyEnrolled, adjunctive) => {
    const eligibility: EligibilityData = {
      residential: residential as string,
      categorical: categorical as string[],
      previouslyEnrolled: previouslyEnrolled as string,
      adjunctive: adjunctive as string[],
    }
    expect(isValidEligibility(eligibility)).toBe(false)
  }
)

it('should be valid if all the requirements are met', () => {
  const eligibility = {
    residential: 'anything',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  expect(isValidEligibility(eligibility)).toBe(true)
})
