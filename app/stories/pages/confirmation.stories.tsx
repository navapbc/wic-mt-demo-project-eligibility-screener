import { ComponentMeta, ComponentStory } from '@storybook/react'

import ConfirmationPage from '@pages/confirmation'

export default {
  title: 'Pages',
  component: ConfirmationPage,
} as ComponentMeta<typeof ConfirmationPage>

const Template: ComponentStory<typeof ConfirmationPage> = () => (
  <ConfirmationPage />
)

export const Confirmation = Template.bind({})
