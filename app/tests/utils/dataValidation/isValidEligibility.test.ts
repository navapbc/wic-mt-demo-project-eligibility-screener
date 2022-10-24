import { EligibilityData } from '@src/types'
import {
  isValidEligibility,
  validEligibilityOptions,
} from '@utils/dataValidation'

const validResidential = validEligibilityOptions.residential[0]
const validCategorical = validEligibilityOptions.categorical[0]
const validPreviouslyEnrolled = validEligibilityOptions.previouslyEnrolled[0]
const validAdjunctive = validEligibilityOptions.adjunctive[0]

export const invalidEligibilityCombinations = [
  ['no values are set', '', [], '', []],
  [
    'residential is not set',
    '',
    [validCategorical],
    validPreviouslyEnrolled,
    [validAdjunctive],
  ],
  [
    'categorical is not set',
    validResidential,
    [],
    validPreviouslyEnrolled,
    [validAdjunctive],
  ],
  [
    'previouslyEnrolled is not set',
    validResidential,
    [validCategorical],
    '',
    [validAdjunctive],
  ],
  [
    'adjunctive is not set',
    validResidential,
    [validCategorical],
    validPreviouslyEnrolled,
    [],
  ],

  [
    'residential is not a valid option',
    'something else',
    [validCategorical],
    validPreviouslyEnrolled,
    [validAdjunctive],
  ],
  [
    'categorical is not a valid option',
    validResidential,
    ['something else'],
    validPreviouslyEnrolled,
    [validAdjunctive],
  ],
  [
    'previouslyEnrolled is not a valid option',
    validResidential,
    [validCategorical],
    'something else',
    [validAdjunctive],
  ],
  [
    'adjunctive is not a valid option',
    validResidential,
    [validCategorical],
    validPreviouslyEnrolled,
    ['something else'],
  ],
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
    residential: validResidential,
    categorical: [validCategorical],
    previouslyEnrolled: validPreviouslyEnrolled,
    adjunctive: [validAdjunctive],
  }
  expect(isValidEligibility(eligibility)).toBe(true)
})
