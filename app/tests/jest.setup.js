// Set up Axe
require('@testing-library/jest-dom')
const { toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)

// Mock the nextjs router
jest.mock('next/router', () => require('next-router-mock'))
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'))
// Temporary workaround for all next.js 12.2.0+
// See active issue: https://github.com/scottrippey/next-router-mock/issues/58
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = require('react')
  const router = require('next-router-mock').default
  const RouterContext = createContext(router)
  return { RouterContext }
})
