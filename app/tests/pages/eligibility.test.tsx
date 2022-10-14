import type { SessionData } from '@customTypes/common'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'
import renderer from 'react-test-renderer'

import Eligibility from '@pages/eligibility'

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
    mockRouter.setCurrentUrl('/eligibility')
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
    .create(<Eligibility session={mockSession} setSession={setMockSession} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  setup()
  const { container } = render(
    <Eligibility session={mockSession} setSession={setMockSession} />
  )

  // Must call axe() like this to satisfy react testing.
  let results
  await act(async () => {
    results = await axe(container)
  })

  expect(results).toHaveNoViolations()
})

const combinations = [
  ['no values are set', '', [], '', []],
  ['residential is not set', '', ['anything'], 'anything', ['anything']],
  ['categorical is not set', 'anything', [], 'anything', ['anything']],
  ['previouslyEnrolled is not set', 'anything', ['anything'], '', ['anything']],
  ['adjunctive is not set', 'anything', ['anything'], 'anything', []],
]
it.each(combinations)(
  'action button should be disabled if %s',
  (description, residential, categorical, previouslyEnrolled, adjunctive) => {
    setup()
    // Set the initial mock session values
    mockSession.eligibility.residential = residential as string
    mockSession.eligibility.categorical = categorical as string[]
    mockSession.eligibility.previouslyEnrolled = previouslyEnrolled as string
    mockSession.eligibility.adjunctive = adjunctive as string[]
    render(<Eligibility session={mockSession} setSession={setMockSession} />)

    // Check the button is disabled.
    const button = screen.getByRole('button', { name: /Continue/i })
    expect(button).toBeDisabled()
  }
)

it('action button should be enabled if all requirements are met', () => {
  setup()
  // Set the initial mock session values
  mockSession.eligibility.residential = 'anything'
  mockSession.eligibility.categorical = ['anything']
  mockSession.eligibility.previouslyEnrolled = 'anything'
  mockSession.eligibility.adjunctive = ['anything']
  render(<Eligibility session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const user = setup()

  render(<Eligibility session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  // Select a residental option.
  const residential = screen.getAllByRole('radio', { name: /Yes/i })[0]
  expect(residential).not.toBeChecked()
  await user.click(residential)
  expect(residential).toBeChecked()
  expect(button).toBeDisabled()

  // Select a categorical option.
  const categorical = screen.getByRole('checkbox', {
    name: /I'm pregnant/i,
  })
  expect(categorical).not.toBeChecked()
  await user.click(categorical)
  expect(categorical).toBeChecked()
  expect(button).toBeDisabled()

  // Select a previouslyEnrolled option.
  const previouslyEnrolled = screen.getAllByRole('radio', {
    name: /Yes/i,
  })[1]
  expect(previouslyEnrolled).not.toBeChecked()
  await user.click(previouslyEnrolled)
  expect(previouslyEnrolled).toBeChecked()
  expect(button).toBeDisabled()

  // Select a adjunctive option.
  const adjunctive = screen.getByRole('checkbox', { name: /FDPIR/i })
  expect(adjunctive).not.toBeChecked()
  await user.click(adjunctive)
  expect(adjunctive).toBeChecked()
  // The button should finally be enabled.
  expect(button).not.toBeDisabled()

  // De-select a categorical option.
  await user.click(categorical)
  expect(categorical).not.toBeChecked()
  // The button should not be disabled again.
  expect(button).toBeDisabled()

  // Re-select a categorical option.
  await user.click(categorical)
  expect(categorical).toBeChecked()
  expect(button).not.toBeDisabled()

  // De-select a adjunctive option.
  await user.click(adjunctive)
  expect(adjunctive).not.toBeChecked()
  // The button should not be disabled again.
  expect(button).toBeDisabled()

  // Re-select a adjunctive option.
  await user.click(adjunctive)
  expect(adjunctive).toBeChecked()
  expect(button).not.toBeDisabled()
})

it('action button should render differently in review mode', () => {
  // Set the path to review mode.
  act(() => {
    mockRouter.setCurrentUrl('/eligibility?mode=review')
  })
  mockSession = cloneDeep(initialSessionData)
  render(<Eligibility session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Update/i })
  expect(button).toBeInTheDocument()
})

it('should route to /other-benefits by default', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.eligibility = {
    residential: 'anything',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
})

it('should route to /other-benefits if categorical includes none', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.eligibility = {
    residential: 'yes',
    categorical: ['anything', 'none'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
})

it('should route to /income if adjunctive includes none', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.eligibility = {
    residential: 'yes',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything', 'none'],
  }
  render(<Eligibility session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/income' })
})

it('should route to /choose-clinic if adjunctive qualifies', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.eligibility = {
    residential: 'yes',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/choose-clinic' })
})
