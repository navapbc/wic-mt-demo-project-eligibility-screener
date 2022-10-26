import { act, render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { enableFetchMocks } from 'jest-fetch-mock'
import mockEnv from 'mocked-env'
import singletonRouter, { useRouter } from 'next/router'

import Review from '@pages/review'

import { getMockSessionData } from '../helpers/mockData'
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

// Mock fetch().
enableFetchMocks()
beforeEach(() => {
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
    />
  )

  fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }))
  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)
  expect(fetchMock.mock.calls.length).toEqual(0)

  expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
})

it('should submit a properly formatted session', async () => {
  // // Mock process.env
  // const restore = mockEnv({
  //   API_HOST: 'dummyApi',
  // })

  const { user } = setup(route)
  const mockSession = getMockSessionData()
  render(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  fetchMock.mockResponseOnce(JSON.stringify({ foo: 'bar' }), { status: 201 })
  const button = screen.getByRole('button', { name: /Submit/i })
  await act(async () => {
    await user.click(button)
  })

  expect(fetchMock.mock.calls.length).toEqual(1)
  // expect(setMockSession).toHaveBeenCalled()
  // expect(mockSession.submitted).toBe(true)
  // expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })

  const { result } = renderHook(() => {
    return useRouter()
  })
  expect(result.current).toMatchObject({ asPath: '/initial' })

  // restore()
})
