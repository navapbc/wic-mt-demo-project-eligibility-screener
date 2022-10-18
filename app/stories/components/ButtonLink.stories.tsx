import { ComponentMeta, ComponentStory } from '@storybook/react'

import ButtonLinkComponent from '@components/ButtonLink'

import ButtonStory from './Button.stories'

export default {
  title: 'Components',
  component: ButtonLinkComponent,
  argTypes: {
    href: {
      control: 'text',
    },
    style: ButtonStory.argTypes.style,
  },
} as ComponentMeta<typeof ButtonLinkComponent>

const Template: ComponentStory<typeof ButtonLinkComponent> = (args) => (
  <ButtonLinkComponent {...args} />
)

export const ButtonLink = Template.bind({})

ButtonLink.args = {
  href: '/test',
  labelKey: 'Primary',
  disabled: false,
  style: 'default',
}
