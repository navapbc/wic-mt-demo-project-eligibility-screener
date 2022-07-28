import { ComponentMeta, ComponentStory } from '@storybook/react'

import ContactPage from '@pages/contact'

export default {
  title: 'Pages',
  component: ContactPage,
} as ComponentMeta<typeof ContactPage>

const Template: ComponentStory<typeof ContactPage> = () => <ContactPage />

export const Contact = Template.bind({})
