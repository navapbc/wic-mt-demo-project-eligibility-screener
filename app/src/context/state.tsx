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
  setSession:
    | Dispatch<
        SetStateAction<{
          contact: {
            firstName: string
            lastName: string
            phone: string
            other: string
          }
        }>
      >
    | (() => unknown)
}

export const AppContext = createContext<AppContextType>({
  session: {
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      other: '',
    },
  },
  setSession: () => {
    console.log('here')
  },
})

export function useAppContext() {
  return useContext(AppContext)
}
