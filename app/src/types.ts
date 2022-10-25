import { Dispatch, SetStateAction } from 'react'
import { UrlObject } from 'url'

/*
 * Types relating to persistent user data
 */
export type Clinic = {
  id: number
  agency: string
  agencyAddress: string
  agencyTelephone: string
  clinic: string
  clinicAddress: string
  clinicTelephone: string
  county: string
  zip: string
}

export type ChooseClinicData = {
  clinic: Clinic | undefined
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

export interface ClearSession extends WriteSession {
  sessionKey: string
}

/**
 * Types relating to page routing.
 */
export interface Page {
  backRoute?: string
  forwardRoute?: UrlObject | string
  reviewMode?: boolean
}

/**
 * Types of pages.
 */
export type ReadOnlyPage = ReadSession & Page
export type EditablePage = WriteSession & Page
export type ClearablePage = ClearSession & Page

/**
 * i18n types.
 */
export type i18nKey = string
