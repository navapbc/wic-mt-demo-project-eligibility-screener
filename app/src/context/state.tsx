import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type DefaultState = {
  contact: {
    firstName: string
    lastName: string
    phone: string
    other: string
  }
  eligibility: {
    residential: string
    pregnant: boolean
    baby: boolean
    child: boolean
    guardian: boolean
    none: boolean
    loss: boolean
    insurance: boolean
    snap: boolean
    tanf: boolean
    none2: boolean
  }
}
interface AppContextType {
  session: DefaultState
  setSession: Dispatch<SetStateAction<DefaultState>> | (() => unknown)
}

export const AppContext = createContext<AppContextType>({
  session: {
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      other: '',
    },
    eligibility: {
      residential: '',
      pregnant: false,
      baby: false,
      child: false,
      guardian: false,
      none: false,
      loss: false,
      insurance: false,
      snap: false,
      tanf: false,
      none2: false,
    },
  },
  setSession: () => {
    console.log('here')
  },
})

export function useAppContext() {
  return useContext(AppContext)
}
