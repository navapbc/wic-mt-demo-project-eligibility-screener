import { Trans } from 'next-i18next'
import { ChangeEvent, ReactElement } from 'react'

type Props = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  id: string
  labelKey: string
  required?: boolean
  value: string
}

const TextInput = (props: Props): ReactElement => {
  const { handleChange, id, labelKey, required, value } = props
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        <Trans i18nKey={labelKey} />
        {required && <abbr className="usa-hint usa-hint--required"> *</abbr>}
      </label>
      <input
        className={'usa-input'}
        id={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    </>
  )
}

export default TextInput
