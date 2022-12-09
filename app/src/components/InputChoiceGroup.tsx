import { ChangeEvent } from 'react'

import Accordion from '@components/Accordion'
import Required from '@components/Required'
import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type Choice = {
  checked: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  labelKey: I18nKey
  name: string
  value: string
}

export type InputChoiceGroupProps = {
  accordion?: {
    headerKey: I18nKey
    bodyKey: I18nKey
  }
  choices: Choice[]
  titleKey: I18nKey
  required?: boolean
  type: 'checkbox' | 'radio'
}

const InputChoiceGroup = (props: InputChoiceGroupProps) => {
  const { accordion, choices, titleKey, required, type } = props

  return (
    <fieldset className="usa-fieldset">
      <h2>
        <TransLine i18nKey={titleKey} />
        {required && <Required />}
      </h2>
      {accordion && (
        <Accordion
          headerKey={accordion.headerKey}
          bodyKey={accordion.bodyKey}
        />
      )}
      {choices.map((choice: Choice) => (
        <div className={`usa-${type}`} key={choice.value}>
          <input
            checked={choice.checked}
            className={`usa-${type}__input usa-${type}__input--tile`}
            id={`${choice.name}-${choice.value}`}
            name={choice.name}
            onChange={choice.handleChange}
            type={type}
            value={choice.value}
          />
          <label
            className={`usa-${type}__label`}
            htmlFor={`${choice.name}-${choice.value}`}
          >
            <TransLine i18nKey={choice.labelKey} />
          </label>
        </div>
      ))}
    </fieldset>
  )
}

export default InputChoiceGroup
