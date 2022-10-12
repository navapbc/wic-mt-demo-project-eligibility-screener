import { SessionData } from '@customTypes/common'
import { useState } from 'react'

// Custom hook to persist state across page refresh
export default function useLocalStorage(
  key: string,
  initialValue: SessionData
) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<SessionData>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      // Get from local storage by key
      const item: string | null = window.sessionStorage.getItem(key)

      // TODO: refactor type casting
      const state: SessionData = item
        ? (JSON.parse(item) as SessionData)
        : initialValue

      return state
    } catch (error) {
      // TODO: error handling
      console.log(error)
      return initialValue
    }
  })
  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage.
  const setValue = (value: SessionData) => {
    try {
      // Allow value to be a function so we have same API as useState

      // TODO: refactor type casting
      const valueToStore: SessionData =
        value instanceof Function ? (value(storedValue) as SessionData) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
