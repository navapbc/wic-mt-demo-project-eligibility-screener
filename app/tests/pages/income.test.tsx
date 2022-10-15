import type { SessionData } from '@customTypes/common'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'
import renderer from 'react-test-renderer'

import Income from '@pages/income'

import { initialSessionData } from '@utils/sessionData'

/**
 * Test setup
 */

// Mock the session
let mockSession: SessionData = initialSessionData
export const setMockSession = jest.fn()

// Set the router to the default page path.
function setupDefaultRoute(): void {
  act(() => {
    mockRouter.setCurrentUrl('/income')
  })
}

// Setup function using AHA principle.
// See https://kentcdodds.com/blog/avoid-nesting-when-youre-testing#apply-aha-avoid-hasty-abstractions
// Return type taken from
// https://github.com/testing-library/user-event/pull/983#issuecomment-1185537044
function setup(): ReturnType<typeof userEvent['setup']> {
  setupDefaultRoute()

  // Reset the mock session before each test.
  mockSession = cloneDeep(initialSessionData)

  // Set up userEvent
  // See https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
  const user = userEvent.setup()

  return user
}

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup()
  const tree = renderer
    .create(<Income session={mockSession} setSession={setMockSession} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  setup()
  const { container } = render(
    <Income session={mockSession} setSession={setMockSession} />
  )

  // Must call axe() like this to satisfy react testing.
  let results
  await act(async () => {
    results = await axe(container)
  })

  expect(results).toHaveNoViolations()
})

it('action button should be disabled by default', () => {
  setup()
  render(<Income session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('action button should be enabled if all requirements are met', () => {
  setup()
  // Set the initial mock session values
  mockSession.income.householdSize = '1'
  render(<Income session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const user = setup()

  render(<Income session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  // Select a valid householdSize option.
  const optionOne = screen.getByRole('option', {
    name: '1',
  }) as HTMLOptionElement
  await userEvent.selectOptions(screen.getByRole('combobox'), '1')
  expect(optionOne.selected).toBe(true)
  // The button should be enabled.
  expect(button).not.toBeDisabled()

  // Select an invalid householdSize option.
  const defaultOption = screen.getByRole('option', {
    name: /select/i,
  }) as HTMLOptionElement
  await userEvent.selectOptions(screen.getByRole('combobox'), '')
  expect(defaultOption.selected).toBe(true)
  // The button should be disabled.
  expect(button).toBeDisabled()

  // Re-select a valid option.
  await userEvent.selectOptions(screen.getByRole('combobox'), '1')
  expect(optionOne.selected).toBe(true)
  // The button should be enabled.
  expect(button).not.toBeDisabled()
})

it('action button should render differently in review mode', () => {
  // Set the path to review mode.
  act(() => {
    mockRouter.setCurrentUrl('/income?mode=review')
  })
  mockSession = cloneDeep(initialSessionData)
  render(<Income session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Update/i })
  expect(button).toBeInTheDocument()
})

it('should route to /choose-clinic', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.income = {
    householdSize: '1',
  }
  render(<Income session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/choose-clinic' })
})
