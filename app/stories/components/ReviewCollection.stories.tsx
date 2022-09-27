import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewCollectionComponent from '@components/ReviewCollection'

export default {
  title: 'Components',
  component: ReviewCollectionComponent,
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
      responseKeys: ['response a', 'response b'],
      isList: true,
    },
    {
      labelKey: 'label 2',
      responseKeys: ['response c', 'response d'],
      isList: false,
    },
  ],
  editable: true,
  editHref: '/',
}
