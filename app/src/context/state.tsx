import clinics from '@public/clinic-output/clinics-with-ids.json'
import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export type DefaultState = {
  clinic: typeof clinics[0] | undefined
  contact: {
    firstName: string
    lastName: string
    phone: string
    other: string
  }
  eligibility: {
    residential: string
    categorical: {
      pregnant: boolean
      baby: boolean
      child: boolean
      guardian: boolean
      loss: boolean
      none: boolean
    }
    before: string
    programs: {
      insurance: boolean
      snap: boolean
      tanf: boolean
      fdpir: boolean
      none: boolean
    }
  }
}
interface AppContextType {
  session: DefaultState
  setSession: Dispatch<SetStateAction<DefaultState>> | (() => unknown)
}

export const AppContext = createContext<AppContextType>({
  session: {
    clinic: undefined,
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      other: '',
    },
    eligibility: {
      residential: '',
      categorical: {
        pregnant: false,
        baby: false,
        child: false,
        guardian: false,
        loss: false,
        none: false,
      },
      before: '',
      programs: {
        insurance: false,
        snap: false,
        tanf: false,
        fdpir: false,
        none: false,
      }
    },
  },
  setSession: () => {
    console.log('default context')
  },
})

export function useAppContext() {
  return useContext(AppContext)
}
