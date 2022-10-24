import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Income from '@pages/income'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonReviewMode,
  testActionButtonRoute,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/income'
const backRoute = '/eligibility'
const forwardRoute = '/choose-clinic'
const mockHouseholdSize = '1'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(
    <Income
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
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('action button should render differently in review mode', () => {
  const { mockSession } = setup(route)
  testActionButtonReviewMode(
    <Income
      session={mockSession}
      setSession={setMockSession}
      reviewMode={true}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    route
  )
})

it('should have a back link that matches the backRoute in default mode', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    backRoute
  )
})

it('should have a back link that matches the backRoute in review mode', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Income
      session={mockSession}
      setSession={setMockSession}
      reviewMode={true}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    backRoute
  )
})

it('action button should be disabled by default', () => {
  const { mockSession } = setup(route)
  render(
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('action button should be enabled if all requirements are met', () => {
  const { mockSession } = setup(route)
  mockSession.income.householdSize = mockHouseholdSize
  render(
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should display user values on refresh/page load', () => {
  const { mockSession } = setup(route)
  mockSession.income.householdSize = mockHouseholdSize
  render(
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const optionOne = screen.getByRole('option', {
    name: mockHouseholdSize,
  }) as HTMLOptionElement
  expect(optionOne.selected).toBe(true)
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const { mockSession, user } = setup(route)

  render(
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  // Select a valid householdSize option.
  const optionOne = screen.getByRole('option', {
    name: mockHouseholdSize,
  }) as HTMLOptionElement
  await user.selectOptions(screen.getByRole('combobox'), mockHouseholdSize)
  expect(optionOne.selected).toBe(true)
  // The button should be enabled.
  expect(button).not.toBeDisabled()

  // Select an invalid householdSize option.
  const defaultOption = screen.getByRole('option', {
    name: /select/i,
  }) as HTMLOptionElement
  await user.selectOptions(screen.getByRole('combobox'), '')
  expect(defaultOption.selected).toBe(true)
  // The button should be disabled.
  expect(button).toBeDisabled()

  // Re-select a valid option.
  await user.selectOptions(screen.getByRole('combobox'), mockHouseholdSize)
  expect(optionOne.selected).toBe(true)
  // The button should be enabled.
  expect(button).not.toBeDisabled()
})

it('should have an action button that routes to forwardRoute', async () => {
  const { mockSession, user } = setup(route)
  const element = (
    <Income
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
  testActionButtonRoute(element, forwardRoute, 'Continue', user)
})
