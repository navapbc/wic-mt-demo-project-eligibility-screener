import { ComponentMeta, ComponentStory } from '@storybook/react'

import ClinicPage from '@pages/clinic'

export default {
  title: 'Pages',
  component: ClinicPage,
} as ComponentMeta<typeof ClinicPage>

const Template: ComponentStory<typeof ClinicPage> = () => <ClinicPage />

export const Clinic = Template.bind({})
