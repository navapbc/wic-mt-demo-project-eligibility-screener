import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Dispatch, SetStateAction } from 'react'

/* Types relating to persistent user data */
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
  chooseClinic: {
    clinic: typeof clinics[0] | undefined
    zipCode: string
  }
  contact: {
    firstName: string
    lastName: string
    phone: string
    comments: string
  }
  eligibility: EligibilityData
  income: IncomeData
}

export interface SessionProp {
  session: SessionData
}

export interface ModifySessionProps extends SessionProp {
  setSession: Dispatch<SetStateAction<SessionData>> | (() => unknown)
}
