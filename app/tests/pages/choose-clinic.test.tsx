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
  testActionButtonRoute,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

setupClinicMocks()
const route = '/choose-clinic'
const backRoute = '/income'
const forwardRoute = '/contact'
const invalidZipCode = 'abcde'

function setZipCode(mockSession: SessionData, type: string): SessionData {
  if (type === 'inState') {
    mockSession.chooseClinic.zipCode = mockInStateZipCode
  } else if (type === 'outOfState') {
    mockSession.chooseClinic.zipCode = mockOutofStateZipCode
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
    <ChooseClinic
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
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('action button should render differently in review mode', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()

  testActionButtonReviewMode(
    <ChooseClinic
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
    <ChooseClinic
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
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      reviewMode={true}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    backRoute
  )
})

it('action button should not render if no values are set', () => {
  const { mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  // Check the button doesn't exist.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).not.toBeInTheDocument()
})

it('action button should not render if only the zip code is set', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  // Check the button doesn't exist.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).not.toBeInTheDocument()
})

it('action button should render if only the clinic is set', () => {
  let { mockSession } = setup(route)
  mockSession.chooseClinic.clinic = getMockClinic()
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  // Check the button should exist, but is disabled.
  const button = screen.queryByRole('button', { name: /Continue/i })
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
})

it('action button should be disabled if the zip code is invalid', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'invalid')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('action button should render and be enabled if all requirements are met', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should display user values on refresh/page load', () => {
  let { mockSession } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  expect(zipCodeInput).toHaveValue(mockInStateZipCode)

  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBe(1)
  expect(radioButtons[0]).toBeChecked()
})

it('should have an action button that routes to forwardRoute', async () => {
  let { mockSession, user } = setup(route)
  mockSession = setZipCode(mockSession, 'inState')
  mockSession.chooseClinic.clinic = getMockClinic()
  const element = (
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
  await testActionButtonRoute(element, forwardRoute, 'Continue', user)
})

it('should display invalid zip code error if an invalid zip code is entered', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

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
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  let errorMessage = screen.queryByText(
    /Sorry, we could not find a match for this ZIP code/
  )
  expect(errorMessage).not.toBeInTheDocument()

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockOutofStateZipCode)
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
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBeGreaterThan(0)
  const showMoreButton = screen.getByRole('button', { name: /Show more/i })
  expect(showMoreButton).not.toBeDisabled()
  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()
})

it('should display expand the list if the button show more button is clicked', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  let radioButtons = screen.getAllByRole('radio')
  const unexpandedNumberClinics = radioButtons.length

  const showMoreButton = screen.getByRole('button', { name: /Show more/i })
  expect(showMoreButton).not.toBeDisabled()
  await user.click(showMoreButton)

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).toBeDisabled()

  radioButtons = screen.getAllByRole('radio')
  const expandedNumberClinics = radioButtons.length
  expect(expandedNumberClinics).toBeGreaterThan(unexpandedNumberClinics)
})

it('should enable the action button when a clinic is selected from the unexpanded list', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  let clinic = screen.getByRole('radio', {
    name: new RegExp(getMockClinic().clinic),
  })
  expect(clinic).not.toBeChecked()
  await user.click(clinic)
  expect(clinic).toBeChecked()

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should enable the action button when a clinic is selected from the expanded list', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  const unexpandedClinics = screen.getAllByRole('radio')

  const showMoreButton = screen.getByRole('button', { name: /Show more/i })
  expect(showMoreButton).not.toBeDisabled()
  await user.click(showMoreButton)

  const expandedClinics = screen.getAllByRole('radio')
  const newClinics = expandedClinics.filter(
    (x) => !unexpandedClinics.includes(x)
  )
  await user.click(newClinics[0])

  const button = screen.getByRole('button', { name: /Continue/i })
  expect(button).not.toBeDisabled()
})

it('should remove the clinic list if the zip code field is modified', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBeGreaterThan(0)

  await user.type(zipCodeInput, invalidZipCode)
  const clinicsAfter = screen.queryByRole('radio')
  expect(clinicsAfter).not.toBeInTheDocument()
})

it('should unselect the option if a new zip is searched', async () => {
  const { user, mockSession } = setup(route)
  render(
    <ChooseClinic
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )

  const zipCodeInput = screen.getByRole('searchbox')
  await user.type(zipCodeInput, mockInStateZipCode)

  const searchButton = screen.getByRole('button', { name: /Search/i })
  await user.click(searchButton)

  const radioButtons = screen.getAllByRole('radio')
  await user.click(radioButtons[0])

  await user.click(searchButton)
  const clinicsAfter = screen.getAllByRole('radio')
  clinicsAfter.forEach((clinic) => {
    expect(clinic).not.toBeChecked()
  })
})
