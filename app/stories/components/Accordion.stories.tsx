import { ComponentMeta, ComponentStory } from '@storybook/react'

import AccordionComponent from '@components/Accordion'

export default {
  title: 'Components',
  component: AccordionComponent,
} as ComponentMeta<typeof AccordionComponent>

const Template: ComponentStory<typeof AccordionComponent> = (args) => (
  <AccordionComponent {...args} />
)

export const Accordion = Template.bind({})

Accordion.args = {
  body: 'test accordion body',
  header: 'test accordion header',
}
