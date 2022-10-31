import { isValidZipCode } from '@utils/dataValidation'

it('should be valid for 5 digits strings', () => {
  expect(isValidZipCode('12345')).toBe(true)
})

it('should be valid for 9 digits strings with a dash', () => {
  expect(isValidZipCode('12345-1234')).toBe(true)
})

it('should be invalid for 9 digits strings with no dash', () => {
  expect(isValidZipCode('123451234')).toBe(false)
})

it('should be invalid for 5 character non-digit strings', () => {
  expect(isValidZipCode('aaaaa')).toBe(false)
})

it('should be invalid for 9 character non-digit strings with a dash', () => {
  expect(isValidZipCode('aaaaa-aaaa')).toBe(false)
})
