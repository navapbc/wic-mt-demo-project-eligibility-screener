import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'
import renderer from 'react-test-renderer'

import Contact from '@pages/contact'

import type { SessionData } from '@src/types'

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
    mockRouter.setCurrentUrl('/contact')
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
    .create(<Contact session={mockSession} setSession={setMockSession} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  setup()
  const { container } = render(
    <Contact session={mockSession} setSession={setMockSession} />
  )

  // Must call axe() like this to satisfy react testing.
  let results
  await act(async () => {
    results = await axe(container)
  })

  expect(results).toHaveNoViolations()
})

const combinations = [
  ['no values are set', '', '', ''],
  ['firstName is not set', '', 'anything', 'anything'],
  ['lastName is not set', 'anything', '', 'anything'],
  ['phone is not set', 'anything', 'anything', ''],
]
it.each(combinations)(
  'action button should be disabled if %s',
  (description, firstName, lastName, phone) => {
    setup()
    // Set the initial mock session values
    mockSession.contact.firstName = firstName
    mockSession.contact.lastName = lastName
    mockSession.contact.phone = phone
    render(<Contact session={mockSession} setSession={setMockSession} />)

    // Check the button is disabled.
    const button = screen.getByRole('button', { name: /Continue/i })
    expect(button).toBeDisabled()
  }
)

it('number input should not allow non-numbers', async () => {
  const user = setup()
  render(<Contact session={mockSession} setSession={setMockSession} />)

  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('')
  await user.type(phone, 'not a number')
  expect(phone).toHaveValue('')
})

it('number input should format number', async () => {
  const user = setup()
  render(<Contact session={mockSession} setSession={setMockSession} />)

  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('')
  await user.type(phone, '1231231234')
  expect(phone).toHaveValue('123-123-1234')
})

it('action button should be enabled if all requirements are met', () => {
  setup()
  // Set the initial mock session values
  mockSession.contact.firstName = 'anything'
  mockSession.contact.lastName = 'anything'
  mockSession.contact.phone = '1231231234'
  render(<Contact session={mockSession} setSession={setMockSession} />)

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const user = setup()

  render(<Contact session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  // Enter a first name.
  const firstName = screen.getByRole('textbox', { name: /First/ })
  expect(firstName).toHaveValue('')
  await user.type(firstName, 'Jack')
  expect(firstName).toHaveValue('Jack')
  expect(button).toBeDisabled()

  // Enter a last name.
  const lastName = screen.getByRole('textbox', { name: /Last/ })
  expect(lastName).toHaveValue('')
  await user.type(lastName, 'O Lantern')
  expect(lastName).toHaveValue('O Lantern')
  expect(button).toBeDisabled()

  // Enter a phone number.
  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('')
  await user.type(phone, '1231231234')
  expect(phone).toHaveValue('123-123-1234')
  // Action button should finally not be disabled.
  expect(button).not.toBeDisabled()

  // Clear a text field.
  // The button should be disabled.
  await user.clear(firstName)
  expect(firstName).toHaveValue('')
  expect(button).toBeDisabled()

  // Filling the comments field should not impact the button.
  const comments = screen.getByRole('textbox', { name: /Comments/ })
  expect(comments).toHaveValue('')
  await user.type(comments, 'I wish to submit a comment')
  expect(comments).toHaveValue('I wish to submit a comment')
  expect(button).toBeDisabled()

  // Fill the text field.
  // The button should be enabled.
  await user.type(firstName, 'Jacques')
  expect(firstName).toHaveValue('Jacques')
  expect(button).not.toBeDisabled()
})

it('action button should render differently in review mode', () => {
  // Set the path to review mode.
  act(() => {
    mockRouter.setCurrentUrl('/contact?mode=review')
  })
  mockSession = cloneDeep(initialSessionData)
  render(<Contact session={mockSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Update/i })
  expect(button).toBeInTheDocument()
})

it('should route to /review', async () => {
  const user = setup()
  const filledSession = cloneDeep(mockSession)
  filledSession.contact = {
    firstName: 'Jack',
    lastName: 'O Lantern',
    phone: '123-123-1234',
    comments: '',
  }
  render(<Contact session={filledSession} setSession={setMockSession} />)
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)

  expect(singletonRouter).toMatchObject({ asPath: '/review' })
})
