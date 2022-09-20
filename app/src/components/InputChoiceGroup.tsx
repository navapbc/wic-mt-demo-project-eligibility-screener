import React, { ReactElement } from 'react'

import Accordion from '@components/Accordion'

interface Choice {
  checked: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  name?: string
  value: string
}

type Props = {
  accordion?: {
    headerKey: string
    bodyKey: string
  }
  choices: Choice[]
  title: string
  required?: boolean
  type: 'checkbox' | 'radio'
}

const InputChoiceGroup = (props: Props): ReactElement => {
  const { accordion, choices, title, required, type } = props

  return (
    <fieldset className="usa-fieldset">
      <h2>
        {title}
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
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
            id={choice.value}
            name={choice.name}
            onChange={choice.handleChange}
            type={type}
            value={choice.value}
          />
          <label className={`usa-${type}__label`} htmlFor={choice.value}>
            {choice.label}
          </label>
        </div>
      ))}
    </fieldset>
  )
}

export default InputChoiceGroup
