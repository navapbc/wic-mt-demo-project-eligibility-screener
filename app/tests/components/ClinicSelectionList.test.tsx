// Import the mocked list of filtered clinics.
// This path is mocked in jest.config.js to point at __mocks__.
import mockFilteredClinics from '@public/clinic-output/clinics-with-ids.json'
import { render, screen } from '@testing-library/react'
import cloneDeep from 'lodash/cloneDeep'

import ClinicSelectionList from '@components/ClinicSelectionList'

import { getMockClinic, setupClinicMocks } from '../helpers/setupClinics'
import { testSnapshot } from '../helpers/sharedTests'

/**
 * Test setup
 */

setupClinicMocks()
const mockSelectedClinic = getMockClinic()
const testProps = {
  filteredClinics: mockFilteredClinics,
  expandList: false,
  setExpandList: jest.fn(),
  selectedClinic: mockSelectedClinic,
  handleSelection: jest.fn(),
  disabled: false,
  actionButton: {
    labelKey: 'continue',
    href: '/somewhere',
  },
}

/**
 * Begin tests
 */

it('should match snapshot if the list is not expanded', () => {
  testSnapshot(<ClinicSelectionList {...testProps} />)
})

it('should match snapshot if the list is expanded', () => {
  testSnapshot(<ClinicSelectionList {...testProps} expandList={true} />)
})

it('should match snapshot if the list is empty', () => {
  testSnapshot(<ClinicSelectionList {...testProps} filteredClinics={[]} />)
})

it('should display the right number of clinics if the list is not expanded', () => {
  render(<ClinicSelectionList {...testProps} />)
  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBe(4)
})

it('should display the right number of clinics if the list is expanded', () => {
  render(<ClinicSelectionList {...testProps} expandList={true} />)
  const radioButtons = screen.getAllByRole('radio')
  expect(radioButtons.length).toBe(mockFilteredClinics.length)
})

it('should not display the show more button if the list is already expanded', () => {
  render(<ClinicSelectionList {...testProps} expandList={true} />)
  const button = screen.queryByRole('button', { name: /show more/i })
  expect(button).not.toBeInTheDocument()
})

it('should not display the show more button if the filterd clinics list has only one clinic', () => {
  render(
    <ClinicSelectionList {...testProps} filteredClinics={[getMockClinic()]} />
  )
  const button = screen.queryByRole('button', { name: /show more/i })
  expect(button).not.toBeInTheDocument()
})

it('should only display the show more button if the filtered clinics list has multiple and the list is not already expanded', () => {
  render(<ClinicSelectionList {...testProps} />)
  const button = screen.getByRole('button', { name: /show more/i })
  expect(button).toBeInTheDocument()
})

it('should display the selected clinic as selected', () => {
  render(<ClinicSelectionList {...testProps} expandList={true} />)
  const radioButton = screen.getByRole('radio', {
    name: new RegExp(mockSelectedClinic.clinic),
  })
  expect(radioButton).toBeChecked()
})

it('should control the action button', () => {
  render(<ClinicSelectionList {...testProps} disabled={true} />)
  const button = screen.getByRole('button', { name: /continue/i })
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
})
