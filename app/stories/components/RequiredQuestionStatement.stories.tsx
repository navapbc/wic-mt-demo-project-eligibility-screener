import { ComponentMeta, ComponentStory } from '@storybook/react'

import RequiredQuestionStatementComponent from '@components/RequiredQuestionStatement'

export default {
  title: 'Components',
  component: RequiredQuestionStatementComponent,
} as ComponentMeta<typeof RequiredQuestionStatementComponent>

const Template: ComponentStory<
  typeof RequiredQuestionStatementComponent
> = () => <RequiredQuestionStatementComponent />

export const RequiredQuestionStatement = Template.bind({})
