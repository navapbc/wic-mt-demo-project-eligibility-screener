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

  let textElement: ReactElement
  if (type === 'area') {
    textElement = (
      <textarea
        className={'usa-textarea'}
        id={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    )
  } else {
    textElement = (
      <input
        className={'usa-input'}
        id={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    )
  }

  return (
    <>
      <label className="usa-label" htmlFor={id}>
        {label}
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
      </label>
      {textElement}
    </>
  )
}

export default TextInput
