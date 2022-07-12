import { ComponentMeta, ComponentStory } from '@storybook/react'

import InputChoiceGroupComponent from '../../src/components/InputChoiceGroup'

export default {
  title: 'Components',
  component: InputChoiceGroupComponent
} as ComponentMeta<typeof InputChoiceGroupComponent>

const Template: ComponentStory<typeof InputChoiceGroupComponent> = (args) => (
  <InputChoiceGroupComponent {...args} />
)

export const InputChoiceGroup = Template.bind({})

InputChoiceGroup.args = {
  choices: [
    {
      checked: true,
      handleChange: () => {},
      label: 'Yes',
      value: 'yes'
    },
    {
      checked: false,
      handleChange: () => {},
      label: 'No',
      value: 'no'
    }
  ],
  type: 'radio',
  title: 'Choice Group Options'
}
