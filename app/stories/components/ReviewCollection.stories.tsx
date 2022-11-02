import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewCollectionComponent from '@components/ReviewCollection'

export default {
  title: 'Components',
  component: ReviewCollectionComponent,
  argTypes: {
    editHref: {
      control: 'text',
    },
  },
} as ComponentMeta<typeof ReviewCollectionComponent>

const Template: ComponentStory<typeof ReviewCollectionComponent> = (args) => (
  <ReviewCollectionComponent {...args} />
)

export const ReviewCollection = Template.bind({})

ReviewCollection.args = {
  headerKey: 'header',
  reviewElements: [
    {
      labelKey: 'label 1',
      children: <div>response a</div>,
    },
    {
      labelKey: 'label 2',
      children: <div>response b</div>,
    },
  ],
  editable: true,
  editHref: '/',
}
