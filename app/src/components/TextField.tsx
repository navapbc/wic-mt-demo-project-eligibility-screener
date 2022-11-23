import { Trans } from 'next-i18next'
import { ChangeEvent, ReactElement } from 'react'

import Required from '@components/Required'

import { I18nKey } from '@src/types'

export type TextFieldProps = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void
  id: string
  labelKey: I18nKey
  required?: boolean
  type?: 'input' | 'textarea'
  value: string
}

const TextField = (props: TextFieldProps): ReactElement => {
  const { handleChange, id, labelKey, required, type, value } = props
  let textfield: ReactElement
  if (type === 'textarea') {
    textfield = (
      <textarea
        className="usa-textarea"
        id={id}
        name={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    )
  } else {
    textfield = (
      <input
        className="usa-input"
        id={id}
        name={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    )
  }
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        <Trans i18nKey={labelKey} />
        {required && <Required />}
      </label>
      {textfield}
    </>
  )
}

export default TextField
