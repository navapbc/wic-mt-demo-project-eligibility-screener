import { Trans } from 'next-i18next'
import React, { ReactElement } from 'react'

import Accordion from '@components/Accordion'
import Required from '@components/Required'

interface Choice {
  checked: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  labelKey: string
  name: string
  value: string
}

type Props = {
  accordion?: {
    headerKey: string
    bodyKey: string
  }
  choices: Choice[]
  titleKey: string
  required?: boolean
  type: 'checkbox' | 'radio'
}

const InputChoiceGroup = (props: Props): ReactElement => {
  const { accordion, choices, titleKey, required, type } = props

  return (
    <fieldset className="usa-fieldset">
      <h2>
        <Trans i18nKey={titleKey} />
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
            <Trans i18nKey={choice.labelKey} />
          </label>
        </div>
      ))}
    </fieldset>
  )
}

export default InputChoiceGroup
