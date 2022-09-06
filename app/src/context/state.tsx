import { Dispatch, SetStateAction, createContext, useContext } from 'react'

type DefaultState = {
  contact: {
    firstName: string
    lastName: string
    phone: string
    other: string
  }
}
interface AppContextType {
  session: DefaultState
  setSession: Dispatch<SetStateAction<undefined>> | (() => {})
}

export const AppContext = createContext<AppContextType>({
  session: { 
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      other: ''
    }
  },
  setSession: () => {}
})

export function useAppContext() {
  return useContext(AppContext)
}
