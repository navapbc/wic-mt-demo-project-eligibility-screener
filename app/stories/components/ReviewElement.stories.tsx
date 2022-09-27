import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewElementComponent from '@components/ReviewElement'

export default {
  title: 'Components',
  component: ReviewElementComponent,
} as ComponentMeta<typeof ReviewElementComponent>

const Template: ComponentStory<typeof ReviewElementComponent> = (args) => (
  <ReviewElementComponent {...args} />
)

export const ReviewElement = Template.bind({})

ReviewElement.args = {
  labelKey: 'label',
  responseKeys: ['response a', 'response b'],
  isList: true,
}
