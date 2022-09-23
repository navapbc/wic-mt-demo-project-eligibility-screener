import { ComponentMeta, ComponentStory } from '@storybook/react'

import SummaryPage from '@pages/summary'

export default {
  title: 'Pages',
  component: SummaryPage,
} as ComponentMeta<typeof SummaryPage>

const Template: ComponentStory<typeof SummaryPage> = () => <SummaryPage />

export const Summary = Template.bind({})
