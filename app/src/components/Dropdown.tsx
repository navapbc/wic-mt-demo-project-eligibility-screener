import { ChangeEvent, ReactElement } from 'react'
import styled from 'styled-components'

interface Props<T> {
  handleChange: (
    e: ChangeEvent<HTMLSelectElement> & { target: { value: T } }
  ) => void
  id: string
  label: string
  options: string[]
}

const Dropdown = <T extends string>(props: Props<T>): ReactElement => {
  const { handleChange, id, label, options } = props

  return (
    <form className="usa-form">
      <Label className="usa-label" htmlFor={id}>
        <strong>{label}</strong>
      </Label>
      <select className="usa-select" id={id} onChange={handleChange}>
        <option value={undefined}>- Select -</option>
        {options.map((option: string) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  )
}

const Label = styled.label`
  font-family: 'Balsamiq Sans', cursive;
`

export default Dropdown
