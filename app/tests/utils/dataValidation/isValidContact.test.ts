import { ContactData } from '@src/types'
import { isValidContact } from '@utils/dataValidation'

export const invalidContactCombinations = [
  ['no values are set', '', '', ''],
  ['firstName is not set', '', 'anything', 'anything'],
  ['lastName is not set', 'anything', '', 'anything'],
  ['phone is not set', 'anything', 'anything', ''],
]

it.each(invalidContactCombinations)(
  'should be invalid if %s',
  (description, firstName, lastName, phone) => {
    const contact: ContactData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      comments: '',
    }
    expect(isValidContact(contact)).toBe(false)
  }
)

it('should be valid if all the requirements are met', () => {
  const contact = {
    firstName: 'anything',
    lastName: 'anything',
    phone: '1231231234',
    comments: 'anything',
  }
  expect(isValidContact(contact)).toBe(true)
})

it('should be invalid if phone is < 10 digits', () => {
  const contact = {
    firstName: 'anything',
    lastName: 'anything',
    phone: 'abcde',
    comments: 'anything',
  }
  expect(isValidContact(contact)).toBe(false)
})

it('should be invalid if phone is > 10 digits', () => {
  const contact = {
    firstName: 'anything',
    lastName: 'anything',
    phone: '12312312345',
    comments: 'anything',
  }
  expect(isValidContact(contact)).toBe(false)
})
