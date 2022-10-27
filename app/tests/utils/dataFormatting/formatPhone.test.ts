import { formatPhone } from '@utils/dataFormatting'

it('should return a formatted phone number', () => {
  const result = formatPhone('1231231234')
  expect(result).toBe('123-123-1234')
})

it('should strip non digits', () => {
  const result = formatPhone('123abc123abc1234')
  expect(result).toBe('123-123-1234')
})

it('should return empty string if the phone number is too long', () => {
  const result = formatPhone('12312312345')
  expect(result).toBe('')
})

it('should return empty string if the phone number is too short', () => {
  const result = formatPhone('123')
  expect(result).toBe('')
})
