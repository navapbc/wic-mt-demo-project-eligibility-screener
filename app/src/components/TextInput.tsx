import { ChangeEvent, ReactElement } from 'react'

type Props = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  id: string
  label: string
  required?: boolean
  type?: 'area'
  value: string
}

const TextInput = (props: Props): ReactElement => {
  const { handleChange, id, label, type, required, value } = props

  return (
    <>
      <label className="usa-label" htmlFor={id}>
        {label}
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
      </label>
      <input
        className={`${type === 'area' ? 'usa-textarea' : 'usa-input'}`}
        id={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    </>
  )
}

export default TextInput
