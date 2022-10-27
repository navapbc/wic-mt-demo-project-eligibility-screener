import { ComponentMeta, ComponentStory } from '@storybook/react'

import PageErrorComponent from '@components/PageError'

export default {
  title: 'Components',
  component: PageErrorComponent,
} as ComponentMeta<typeof PageErrorComponent>

const Template: ComponentStory<typeof PageErrorComponent> = (args) => (
  <PageErrorComponent {...args} />
)

export const PageError = Template.bind({})

PageError.args = {
  alertBody: 'Alert body text',
}
