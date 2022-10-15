import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Eligibility from '@pages/eligibility'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonReviewMode,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/eligibility'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(
    <Eligibility session={mockSession} setSession={setMockSession} />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Eligibility session={mockSession} setSession={setMockSession} />
  )
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
    const { mockSession } = setup(route)

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
  const { mockSession } = setup(route)

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
  const { mockSession, user } = setup(route)

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
  const { mockSession } = setup(route)
  testActionButtonReviewMode(
    <Eligibility session={mockSession} setSession={setMockSession} />,
    route
  )
})

it('should route to /other-benefits by default', async () => {
  const { mockSession, user } = setup(route)
  mockSession.eligibility = {
    residential: 'anything',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
})

it('should route to /other-benefits if categorical includes none', async () => {
  const { mockSession, user } = setup(route)
  mockSession.eligibility = {
    residential: 'yes',
    categorical: ['anything', 'none'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
})

it('should route to /income if adjunctive includes none', async () => {
  const { mockSession, user } = setup(route)
  mockSession.eligibility = {
    residential: 'yes',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything', 'none'],
  }
  render(<Eligibility session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/income' })
})

it('should route to /choose-clinic if adjunctive qualifies', async () => {
  const { mockSession, user } = setup(route)
  mockSession.eligibility = {
    residential: 'yes',
    categorical: ['anything'],
    previouslyEnrolled: 'anything',
    adjunctive: ['anything'],
  }
  render(<Eligibility session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/choose-clinic' })
})
