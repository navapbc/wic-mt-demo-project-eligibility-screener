import { ReactElement, ChangeEvent } from 'react'
import styled from 'styled-components'

type Props = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
  id: string,
  label: string,
  value: string
}

const TextInput = (props: Props): ReactElement => {
  const { handleChange, id, label, value } = props

  return (
    <>
      <Label
        className="usa-label"
        htmlFor={id}
      >
        {label}
      </Label>
      <Input
        className="usa-input"
        id={id}
        onChange={handleChange}
        role='textbox'
        value={value}
      />
    </>
  )
}

const Input = styled.input`
  border: 1px solid #B3B3B3;
  border-radius: 4px;
  height: 48px;
`

const Label = styled.label`
  font-family: 'Balsamiq Sans',cursive;
  font-size: 20px;
`

export default TextInput
