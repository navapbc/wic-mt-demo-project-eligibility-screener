import { isValidIncome } from '@utils/dataValidation'

it('should be valid if householdSize is set', () => {
  const income = { householdSize: '3' }
  expect(isValidIncome(income)).toBe(true)
})

it('should be invalid if householdSize is not set', () => {
  const income = { householdSize: '' }
  expect(isValidIncome(income)).toBe(false)
})
