import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Dispatch, SetStateAction } from 'react'

export type SessionData = {
  clinic: typeof clinics[0] | undefined
  contact: {
    firstName: string
    lastName: string
    phone: string
    comments: string
  }
  eligibility: {
    residential: string
    pregnant: boolean
    baby: boolean
    child: boolean
    guardian: boolean
    none: boolean
    loss: boolean
    before: string
    insurance: boolean
    snap: boolean
    tanf: boolean
    fdpir: boolean
    none2: boolean
  }
}

export interface SessionProp {
  session: SessionData
}

export interface ModifySessionProps extends SessionProp {
  setSession: Dispatch<SetStateAction<SessionData>> | (() => unknown)
}
