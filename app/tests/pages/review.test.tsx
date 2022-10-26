import { act, render, screen, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { enableFetchMocks } from 'jest-fetch-mock'
import mockEnv from 'mocked-env'
import singletonRouter, { useRouter } from 'next/router'

import Review from '@pages/review'

import { getMockSessionData } from '../helpers/mockData'
import { setMockSession, setup, setupUserEvent } from '../helpers/setup'
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
  fetchMock.dontMock()
})

/**
 * Begin tests
 */

it.skip('should match full page snapshot', () => {
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

it.skip('should pass accessibility scan', async () => {
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

it.skip('should have a back link that matches the backRoute', () => {
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

  fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }))
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    expect(fetchMock.mock.calls.length).toEqual(0)
    expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
  })
})

it('should submit a properly formatted session', async () => {
  const user = setupUserEvent()
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
  fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 201 })
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    expect(fetchMock.mock.calls.length).toEqual(1)
    expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
    expect(setMockSession).toHaveBeenCalled()
  })
})

it('should handle submission errors', async () => {
  const user = setupUserEvent()
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
  // fetchMock.mockResponse(JSON.stringify({ foo: 'bar' }), { status: 400 })
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)

  // Must waitFor() the result since we rely on route changes in this case to be async.
  // See https://github.com/scottrippey/next-router-mock#sync-vs-async
  await waitFor(() => {
    expect(fetchMock.mock.calls.length).toEqual(2)
    expect(singletonRouter).toMatchObject({ asPath: '/review' })
    expect(setMockSession).toHaveBeenCalled()

    const error = screen.getByText(/Error/)
    expect(error).toBeInTheDocument()
  })
})
