import { ComponentMeta, ComponentStory } from '@storybook/react'

import RequiredComponent from '@components/Required'

export default {
  title: 'Components',
  component: RequiredComponent,
} as ComponentMeta<typeof RequiredComponent>

const Template: ComponentStory<typeof RequiredComponent> = () => (
  <RequiredComponent />
)

export const Required = Template.bind({})
