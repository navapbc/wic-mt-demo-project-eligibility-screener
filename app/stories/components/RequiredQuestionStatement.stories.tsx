import { Meta, Story } from '@storybook/react'

import { RequiredQuestionStatement as RequiredQuestionStatementComponent } from '@components/RequiredQuestionStatement'

export default {
  title: 'Components',
  component: RequiredQuestionStatementComponent,
} as Meta

const Template: Story = (args) => (
  <RequiredQuestionStatementComponent {...args} />
)

export const RequiredQuestionStatement = Template.bind({})
