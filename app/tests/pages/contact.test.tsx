import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Contact from '@pages/contact'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonReviewMode,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'
import { invalidContactCombinations } from '../utils/dataValidation/isValidContact.test'

/**
 * Test setup
 */

const route = '/contact'
const backRoute = '/choose-clinic'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )
})

it('action button should render differently in review mode', () => {
  const { mockSession } = setup(route)
  testActionButtonReviewMode(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      reviewMode={true}
      backRoute={backRoute}
    />,
    route
  )
})

it('should have a back link that matches the backRoute in default mode', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />,
    backRoute
  )
})

it('should have a back link that matches the backRoute in review mode', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      reviewMode={true}
      backRoute={backRoute}
    />,
    backRoute
  )
})

it.each(invalidContactCombinations)(
  'action button should be disabled if %s',
  (description, firstName, lastName, phone) => {
    const { mockSession } = setup(route)
    // Set the initial mock session values
    mockSession.contact.firstName = firstName
    mockSession.contact.lastName = lastName
    mockSession.contact.phone = phone
    render(
      <Contact
        session={mockSession}
        setSession={setMockSession}
        backRoute={backRoute}
      />
    )

    // Check the button is disabled.
    const button = screen.getByRole('button', { name: /Continue/i })
    expect(button).toBeDisabled()
  }
)

it('number input should not allow non-numbers', async () => {
  const { mockSession, user } = setup(route)
  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )

  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('')

  await user.type(phone, 'not a number')
  expect(phone).toHaveValue('')
})

it('number input should visually format number', async () => {
  const { mockSession, user } = setup(route)
  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )

  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('')

  await user.type(phone, '1231231234')
  expect(phone).toHaveValue('123-123-1234')
})

it('action button should be enabled if all requirements are met', () => {
  const { mockSession } = setup(route)
  mockSession.contact.firstName = 'anything'
  mockSession.contact.lastName = 'anything'
  mockSession.contact.phone = '1231231234'
  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )

  // Check the button is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should display user values on refresh/page load', () => {
  const { mockSession } = setup(route)
  mockSession.contact.firstName = 'Jack'
  mockSession.contact.lastName = 'O Lantern'
  mockSession.contact.phone = '1231231234'
  mockSession.contact.comments = 'I wish to submit a comment'
  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )

  const firstName = screen.getByRole('textbox', { name: /First/ })
  expect(firstName).toHaveValue(mockSession.contact.firstName)

  const lastName = screen.getByRole('textbox', { name: /Last/ })
  expect(lastName).toHaveValue(mockSession.contact.lastName)

  const phone = screen.getByRole('textbox', { name: /Phone/ })
  expect(phone).toHaveValue('123-123-1234')

  const comments = screen.getByRole('textbox', { name: /Comments/ })
  expect(comments).toHaveValue(mockSession.contact.comments)
})

it('action button should stay disabled until all requirements are met and re-disable if reqirements are unmet', async () => {
  const { mockSession, user } = setup(route)

  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )
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

it('should route to /review', async () => {
  const { mockSession, user } = setup(route)
  mockSession.contact = {
    firstName: 'Jack',
    lastName: 'O Lantern',
    phone: '123-123-1234',
    comments: '',
  }
  render(
    <Contact
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
    />
  )

  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/review' })
})
