import { isValidChooseClinic } from '@utils/dataValidation'

import { getMockClinic } from '../../helpers/setupClinics'

it('should be valid if all requirements are met', () => {
  const chooseClinic = {
    zipCode: '12345',
    clinic: getMockClinic(),
  }
  expect(isValidChooseClinic(chooseClinic)).toBe(true)
})

it('should be invalid if clinic is undefined', () => {
  const chooseClinic = {
    zipCode: '12345',
    clinic: undefined,
  }
  expect(isValidChooseClinic(chooseClinic)).toBe(false)
})

it('should be invalid if zipCode is blank', () => {
  const chooseClinic = {
    zipCode: '',
    clinic: getMockClinic(),
  }
  expect(isValidChooseClinic(chooseClinic)).toBe(false)
})

it('should be invalid if zipCode is invalid', () => {
  const chooseClinic = {
    zipCode: 'abcde',
    clinic: getMockClinic(),
  }
  expect(isValidChooseClinic(chooseClinic)).toBe(false)
})
