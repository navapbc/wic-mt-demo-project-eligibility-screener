import { ChangeEventHandler, ReactElement } from 'react'

type Props = {
  handleChange: ChangeEventHandler<HTMLTextAreaElement>
  id: string
  label: string
  required?: boolean
  value: string
}

const TextInput = (props: Props): ReactElement => {
  const { handleChange, id, label, required, value } = props
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        {label}
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
      </label>
      <textarea
        className={'usa-textarea'}
        id={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    </>
  )
}

export default TextInput
