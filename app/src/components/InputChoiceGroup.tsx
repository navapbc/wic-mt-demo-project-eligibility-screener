import React from 'react'
import styled from 'styled-components'

interface Choice {
  checked: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  name?: string
  value: string
}

type Props = {
  choices: Choice[]
  title: string
  type: 'checkbox' | 'radio'
}

const InputChoiceGroup = (props: Props): JSX.Element => {
  const { choices, title, type } = props

  return (
    <Fieldset className="usa-fieldset">
      <h2>{title}</h2>
      {choices.map((choice: Choice) => (
        <div className={`usa-${type}`} key={choice.value}>
          <input
            className={`usa-${type}__input`}
            id={choice.value}
            name={choice.name}
            type={type}
            role={type}
            value={choice.value}
            checked={choice.checked}
            onChange={choice.handleChange}
          />
          <label className={`usa-${type}__label`} htmlFor={choice.value}>
            {choice.label}
          </label>
        </div>
      ))}
    </Fieldset>
  )
}

const Fieldset = styled.fieldset`
  border: none;
  h2 {
    font-family: 'Balsamiq Sans', cursive;
    font-weight: 300;
  }
  label {
    font-family: 'Balsamiq Sans', cursive;
    font-weight: 300;
  }
`

export default InputChoiceGroup
