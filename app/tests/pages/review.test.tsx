import { render, screen, waitFor } from '@testing-library/react'
import { enableFetchMocks } from 'jest-fetch-mock'
import mockEnv from 'mocked-env'
import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'

import Review from '@pages/review'

import { getMockSessionData } from '@lib/mockData'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/review'
const backRoute = '/contact'
const forwardRoute = '/confirmation'
const baseUrl = 'http://localhost:3000'

// Mock fetch().
enableFetchMocks()
beforeEach(() => {
  fetchMock.resetMocks()
  fetchMock.dontMock()
})

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  const mockSession = getMockSessionData()
  testSnapshot(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )
})

it('should have a back link that matches the backRoute', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />,
    backRoute
  )
})

it('should not resubmit if it has already been submitted', async () => {
  // Mock process.env
  const restore = mockEnv({
    BASE_URL: 'http://something.com',
  })

  const { mockSession, user } = setup(route)
  mockSession.submitted = true
  render(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )

  fetchMock.doMockOnce().mockOnce(JSON.stringify({ foo: 'bar' }))
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    expect(fetchMock.mock.calls.length).toEqual(0)
    expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
  })

  restore()
})

it('should submit a properly formatted session', async () => {
  // Mock process.env
  const restore = mockEnv({
    BASE_URL: 'http://something.com',
  })

  const { user } = setup(route)
  const mockSession = getMockSessionData()
  render(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )

  // Mock the call to /api/eligibility-screener.
  fetchMock
    .doMockOnce()
    .mockOnce(JSON.stringify({ success: true }), { status: 201 })
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
    expect(setMockSession).toHaveBeenCalled()
  })

  restore()
})

it('should handle submission errors', async () => {
  // Mock process.env
  const restore = mockEnv({
    BASE_URL: 'http://something.com',
  })

  const { user } = setup(route)
  const mockSession = getMockSessionData()
  render(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )

  // Mock the call to /api/eligibility-screener.
  fetchMock
    .doMockOnce()
    .mockOnce(JSON.stringify({ success: false }), { status: 410 })
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(singletonRouter).toMatchObject({ asPath: '/review' })
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  restore()
})

it('should handle fetch errors', async () => {
  // Mock process.env
  const restore = mockEnv({
    BASE_URL: 'http://something.com',
  })

  const { user } = setup(route)
  const mockSession = getMockSessionData()
  render(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
      baseUrl={baseUrl}
    />
  )

  // Mock the call to /api/eligibility-screener.
  fetchMock.doMockOnce().mockAbortOnce()
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(singletonRouter).toMatchObject({ asPath: '/review' })
    expect(fetchMock.mock.calls.length).toEqual(1)
  })

  restore()
})
