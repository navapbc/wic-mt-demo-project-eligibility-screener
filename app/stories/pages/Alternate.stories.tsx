import { ComponentMeta, ComponentStory } from '@storybook/react'

import AlternatePage from '@pages/alternate'

export default {
  title: 'Pages',
  component: AlternatePage,
} as ComponentMeta<typeof AlternatePage>

const Template: ComponentStory<typeof AlternatePage> = () => <AlternatePage />

export const Clinic = Template.bind({})
