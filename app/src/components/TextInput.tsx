import { Trans } from 'next-i18next'
import { ChangeEvent, ReactElement } from 'react'

import Required from '@components/Required'

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
        {required && <Required />}
      </label>
      <input
        className="usa-input"
        id={id}
        name={id}
        onInput={handleChange}
        role="textbox"
        value={value}
      />
    </>
  )
}

export default TextInput
