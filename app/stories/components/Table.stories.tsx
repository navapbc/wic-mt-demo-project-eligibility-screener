import { ComponentMeta, ComponentStory } from '@storybook/react'

import TableComponent from '@components/Table'

export default {
  title: 'Components',
  component: TableComponent,
} as ComponentMeta<typeof TableComponent>

const Template: ComponentStory<typeof TableComponent> = (args) => (
  <TableComponent {...args} />
)

export const Table = Template.bind({})

Table.args = {
  editable: true,
  editLink: '/example',
  rows: [
    {
      header: 'sample header',
      body: 'sample body',
    },
    {
      header: 'second header',
      body: 'second body',
    },
  ],
  title: 'sample title',
}
