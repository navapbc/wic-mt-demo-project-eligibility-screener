import { ComponentMeta, ComponentStory } from '@storybook/react'

import ClinicInfoComponent from '@components/ClinicInfo'

export default {
  title: 'Components',
  component: ClinicInfoComponent,
} as ComponentMeta<typeof ClinicInfoComponent>

const Template: ComponentStory<typeof ClinicInfoComponent> = (args) => (
  <ClinicInfoComponent {...args} />
)

export const ClinicInfo = Template.bind({})

ClinicInfo.args = {
  name: 'Montana Town WIC clinic',
  streetAddress: '123 Main St, Helena, MT 59901',
  phone: '(123) 123-1234',
  isFormElement: false,
}
