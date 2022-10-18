import { ComponentMeta, ComponentStory } from '@storybook/react'

import InputChoiceGroupComponent from '@components/InputChoiceGroup'

export default {
  title: 'Components',
  component: InputChoiceGroupComponent,
} as ComponentMeta<typeof InputChoiceGroupComponent>

const Template: ComponentStory<typeof InputChoiceGroupComponent> = (args) => (
  <InputChoiceGroupComponent {...args} />
)

export const InputChoiceGroup = Template.bind({})

InputChoiceGroup.args = {
  accordion: {
    bodyKey: 'test body',
    headerKey: 'test header',
  },
  choices: [
    {
      checked: true,
      handleChange: () => {},
      labelKey: 'Yes',
      value: 'yes',
      name: 'yes',
    },
    {
      checked: false,
      handleChange: () => {},
      labelKey: 'No',
      value: 'no',
      name: 'no',
    },
  ],
  required: true,
  type: 'radio',
  titleKey: 'Choice Group Options',
}
