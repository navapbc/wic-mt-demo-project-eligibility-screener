import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Income from '@pages/income'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonReviewMode,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/income'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(<Income session={mockSession} setSession={setMockSession} />)
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Income session={mockSession} setSession={setMockSession} />
  )
})

it('action button should be disabled by default', () => {
  const { mockSession } = setup(route)
  render(<Income session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('action button should be enabled if all requirements are met', () => {
  const { mockSession } = setup(route)
  mockSession.income.householdSize = '1'
  render(<Income session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const { mockSession, user } = setup(route)

  render(<Income session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  // Select a valid householdSize option.
  const optionOne = screen.getByRole('option', {
    name: '1',
  }) as HTMLOptionElement
  await user.selectOptions(screen.getByRole('combobox'), '1')
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
  await user.selectOptions(screen.getByRole('combobox'), '1')
  expect(optionOne.selected).toBe(true)
  // The button should be enabled.
  expect(button).not.toBeDisabled()
})

it('action button should render differently in review mode', () => {
  const { mockSession } = setup(route)
  testActionButtonReviewMode(
    <Income session={mockSession} setSession={setMockSession} />,
    route
  )
})

it('should route to /choose-clinic', async () => {
  const { mockSession, user } = setup(route)
  mockSession.income = {
    householdSize: '1',
  }
  render(<Income session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/choose-clinic' })
})
