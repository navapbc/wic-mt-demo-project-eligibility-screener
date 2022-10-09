import { Meta, Story } from '@storybook/react'

import { Required as RequiredComponent } from '@components/Required'

export default {
  title: 'Components',
  component: RequiredComponent,
} as Meta

const Template: Story = (args) => <RequiredComponent {...args} />

export const Required = Template.bind({})
