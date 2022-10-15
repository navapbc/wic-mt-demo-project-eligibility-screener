import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  SessionData,
} from '@src/types'

export const initialChooseClinicData: ChooseClinicData = {
  clinic: undefined,
  zipCode: '',
}

export const initialEligibilityData: EligibilityData = {
  residential: '',
  categorical: [],
  previouslyEnrolled: '',
  adjunctive: [],
}

export const initialContactData: ContactData = {
  firstName: '',
  lastName: '',
  phone: '',
  comments: '',
}

export const initialIncomeData: IncomeData = {
  householdSize: '',
}

export const initialSessionData: SessionData = {
  chooseClinic: initialChooseClinicData,
  contact: initialContactData,
  eligibility: initialEligibilityData,
  income: initialIncomeData,
}
