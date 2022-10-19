import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeEvent } from 'react'

import ClinicSelectionListComponent from '@components/ClinicSelectionList'

import mockFilteredClinics from '../../tests/__mocks__/clinics-with-ids-mock.json'

export default {
  title: 'Components/ClinicSelectionList',
  component: ClinicSelectionListComponent,
} as ComponentMeta<typeof ClinicSelectionListComponent>

const Template: ComponentStory<typeof ClinicSelectionListComponent> = (
  args
) => {
  const [expandList, setExpandList] = useState(false)
  args.expandList = expandList
  args.setExpandList = setExpandList

  const [disabled, setDisabled] = useState(true)
  args.disabled = disabled

  const filteredClinics = args.filteredClinics
  const [selectedClinic, setSelectedClinic] = useState(args.selectedClinic)
  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = e.target
    const clinicIndex = filteredClinics?.findIndex(
      (clinic) => clinic?.clinic === value
    )
    setSelectedClinic(filteredClinics[clinicIndex])
    setDisabled(false)
  }
  args.handleSelection = handleSelection
  args.selectedClinic = selectedClinic

  return <ClinicSelectionListComponent {...args} />
}

export const SavedState = Template.bind({})
SavedState.args = {
  filteredClinics: [mockFilteredClinics[1]],
  selectedClinic: mockFilteredClinics[1],
  disabled: false,
  continueBtn: {
    labelKey: 'Continue',
    route: '/',
  },
}

export const BlankState = Template.bind({})
BlankState.args = {
  filteredClinics: mockFilteredClinics,
  continueBtn: {
    labelKey: 'Continue',
    route: '/',
  },
}
