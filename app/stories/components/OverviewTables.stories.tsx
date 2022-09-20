import { ComponentMeta, ComponentStory } from '@storybook/react'

import OverviewTablesComponent from '@components/OverviewTables'

export default {
  title: 'Components',
  component: OverviewTablesComponent,
} as ComponentMeta<typeof OverviewTablesComponent>

const Template: ComponentStory<typeof OverviewTablesComponent> = (args) => (
  <OverviewTablesComponent {...args} />
)

export const OverviewTables = Template.bind({})

OverviewTables.args = {
  editable: false,
}
