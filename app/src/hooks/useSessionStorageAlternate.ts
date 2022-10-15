// Approach taken by Nick Scialli
// See https://typeofnan.dev/using-session-storage-in-react-with-hooks

import { useEffect, useState } from 'react'

function getSessionStorageOrDefault(key, defaultValue) {
  const stored = sessionStorage.getItem(key)
  if (!stored) {
    return defaultValue
  }
  return JSON.parse(stored)
}

export default function useSessionStorage(key, defaultValue) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  )

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
