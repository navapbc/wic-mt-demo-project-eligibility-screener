import { ComponentMeta, ComponentStory } from '@storybook/react'

import ContactPage from '@pages/contact'

export default {
  title: 'Pages/Contact',
  component: ContactPage,
} as ComponentMeta<typeof ContactPage>

const Template: ComponentStory<typeof ContactPage> = () => (
  <ContactPage previousRoute="/review" />
)

export const Contact = Template.bind({})
