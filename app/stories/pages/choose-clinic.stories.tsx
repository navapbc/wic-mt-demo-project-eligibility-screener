import { ComponentMeta, ComponentStory } from '@storybook/react'

import ChooseClinicPage from '@pages/choose-clinic'

export default {
  title: 'Pages',
  component: ChooseClinicPage,
} as ComponentMeta<typeof ChooseClinicPage>

const Template: ComponentStory<typeof ChooseClinicPage> = () => (
  <ChooseClinicPage previousRoute="/review" />
)

export const ChooseClinic = Template.bind({})
