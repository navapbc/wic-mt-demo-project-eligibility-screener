import { Trans } from 'next-i18next'
import { ChangeEventHandler, ReactElement } from 'react'

import Required from '@components/Required'

type Props = {
  handleChange: ChangeEventHandler<HTMLTextAreaElement>
  id: string
  labelKey: string
  required?: boolean
  value: string
}

const TextArea = (props: Props): ReactElement => {
  const { handleChange, id, labelKey, required, value } = props
  return (
    <>
      <label className="usa-label" htmlFor={id}>
        <Trans i18nKey={labelKey} />
        {required && <Required />}
      </label>
      <textarea
        className="usa-textarea"
        id={id}
        name={id}
        onChange={handleChange}
        role="textbox"
        value={value}
      />
    </>
  )
}

export default TextArea
