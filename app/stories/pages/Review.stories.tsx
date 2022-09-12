import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewPage from '@pages/review'

export default {
  title: 'Pages',
  component: ReviewPage,
} as ComponentMeta<typeof ReviewPage>

const Template: ComponentStory<typeof ReviewPage> = () => <ReviewPage />

export const Review = Template.bind({})
