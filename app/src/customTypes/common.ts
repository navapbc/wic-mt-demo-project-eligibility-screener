import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Dispatch, SetStateAction } from 'react'

// @TODO: rename sharedTypes or just put it in /src as types.ts
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

export interface SessionProp {
  session: SessionData
}

export interface ModifySessionProps extends SessionProp {
  setSession: Dispatch<SetStateAction<SessionData>> | (() => unknown)
}
