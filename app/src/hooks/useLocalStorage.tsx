import { DefaultState } from '@context/state'
import { setCookie } from 'cookies-next'
import { useState } from 'react'

// Custom hook to persist state across page refresh
export default function useLocalStorage(
  key: string,
  initialValue: DefaultState
) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<DefaultState>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Get from local storage by key
      const item: string | null = window.localStorage.getItem(key)

      // TODO: refactor type casting
      const state: DefaultState = item
        ? (JSON.parse(item) as DefaultState)
        : initialValue

      return state
    } catch (error) {
      // TODO: error handling
      console.log(error)
      return initialValue
    }
  })
  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: DefaultState) => {
    try {
      // Allow value to be a function so we have same API as useState

      // TODO: refactor type casting
      const valueToStore: DefaultState =
        value instanceof Function ? (value(storedValue) as DefaultState) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        // ADDING THIS TO ACCES SERVER SIDE
        setCookie(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
