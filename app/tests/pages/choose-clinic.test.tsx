import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import ChooseClinic from '@pages/choose-clinic'

import type { SessionData } from '@src/types'

import { setMockSession, setup } from '../helpers/setup'
import {
  getMockClinic,
  mockInStateZipCode,
  mockOutofStateZipCode,
  setupClinicMocks,
} from '../helpers/setupClinics'
import {
  testAccessibility,
  testActionButtonReviewMode,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

setupClinicMocks()
const route = '/choose-clinic'
const inStateZipCode = mockInStateZipCode
const invalidZipCode = 'abcde'
const outofStateZipCode = mockOutofStateZipCode

function setZipCode(mockSession: SessionData, type: string): SessionData {
  if (type === 'inState') {
    mockSession.chooseClinic.zipCode = inStateZipCode
  } else if (type === 'outOfState') {
    mockSession.chooseClinic.zipCode = outofStateZipCode
  } else if (type === 'invalid') {
    mockSession.chooseClinic.zipCode = invalidZipCode
  } else {
    mockSession.chooseClinic.zipCode = ''
  }
  return mockSession
}

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(
    <ChooseClinic session={mockSession} setSession={setMockSession} />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <ChooseClinic session={mockSession} setSession={setMockSession} />
  )
})

it('action button should render differently in review mode', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()

  testActionButtonReviewMode(
    <ChooseClinic session={mockSession} setSession={setMockSession} />,
    route
  )
})

it('action button should not render if no values are set', () => {
  const { mockSession } = setup(route)
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  // Check the button doesn't exist.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).not.toBeInTheDocument()
})

it('action button should not render if only the zip code is set', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  // Check the button doesn't exist.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).not.toBeInTheDocument()
})

it('action button should render if only the clinic is set', () => {
  let { mockSession } = setup(route)
  mockSession.chooseClinic.clinic = getMockClinic()
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  // Check the button should exist, but is disabled.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
})

it('action button should be disabled if the zip code is invalid', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'invalid')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('action button should render and be enabled if all requirements are met', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  // Check the button should exist and is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should route to /contact', async () => {
  let { mockSession, user } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  // Check the button should exist and is enabled.
  const button = screen.getByRole('button', { name: /Continue/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/contact' })
})

it('should display invalid zip code error if an invalid zip code is entered', async () => {
  const { user, mockSession } = setup(route)
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  let errorMessage = screen.queryByText(
    /Please enter 5 digits for the ZIP code/
  )
  expect(errorMessage).not.toBeInTheDocument()

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, invalidZipCode)
  expect(errorMessage).not.toBeInTheDocument()

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)
  errorMessage = screen.queryByText(/Please enter 5 digits for the ZIP code/)
  expect(errorMessage).toBeInTheDocument()
})

it('should display out of state zip code error if an out of state zip is entered', async () => {
  const { user, mockSession } = setup(route)
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  let errorMessage = screen.queryByText(
    /Sorry, we could not find a match for this ZIP code/
  )
  expect(errorMessage).not.toBeInTheDocument()

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, outofStateZipCode)
  expect(errorMessage).not.toBeInTheDocument()

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)
  errorMessage = screen.queryByText(
    /Sorry, we could not find a match for this ZIP code/
  )
  expect(errorMessage).toBeInTheDocument()
})

it('should display a list of clinics if an in state zip is entered', async () => {
  const { user, mockSession } = setup(route)
  render(<ChooseClinic session={mockSession} setSession={setMockSession} />)

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, inStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBe(4)
  const showMoreButton = screen.getByRole('button', { name: /Show more/i })
  expect(showMoreButton).not.toBeDisabled()
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})
