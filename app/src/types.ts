import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Dispatch, SetStateAction } from 'react'

/* Types relating to persistent user data */
export type ChooseClinicData = {
  clinic: typeof clinics[0] | undefined
  zipCode: string
}

export type ContactData = {
  firstName: string
  lastName: string
  phone: string
  comments: string
}

export type EligibilityData = {
  residential: string
  categorical: string[]
  previouslyEnrolled: string
  adjunctive: string[]
}

export type IncomeData = {
  householdSize: string
}

export type SessionData = {
  chooseClinic: ChooseClinicData
  contact: ContactData
  eligibility: EligibilityData
  income: IncomeData
}

export interface ReadSession {
  session: SessionData
}

export interface WriteSession extends ReadSession {
  setSession: Dispatch<SetStateAction<SessionData>> | (() => unknown)
}

export interface ClearablePage extends WriteSession {
  sessionKey: string
}

export interface EditablePage extends WriteSession {
  // This is an optional attribute to make testing easier.
  // It should be set by default to 'false' in all Editable pages.
  reviewMode?: boolean
}

// Type aliases for page props
export type ReadOnlyPage = ReadSession
