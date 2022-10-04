import { ComponentMeta, ComponentStory } from '@storybook/react'

import ListComponent from '@components/List'

export default {
  title: 'Components',
  component: ListComponent,
} as ComponentMeta<typeof ListComponent>

const Template: ComponentStory<typeof ListComponent> = (args) => (
  <ListComponent {...args} />
)

export const List = Template.bind({})

List.args = {
  i18nKeys: ['List item a', 'List item b', 'List item c'],
}
