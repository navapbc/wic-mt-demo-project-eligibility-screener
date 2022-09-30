import { ComponentMeta, ComponentStory } from '@storybook/react'

import IncomePage from '@pages/income'

export default {
  title: 'Pages/Income',
  component: IncomePage,
} as ComponentMeta<typeof IncomePage>

const Template: ComponentStory<typeof IncomePage> = () => <IncomePage />

export const Income = Template.bind({})
