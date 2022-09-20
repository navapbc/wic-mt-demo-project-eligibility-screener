import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

type Props = {
  text: string
  type: 'error' | 'info' | 'success' | 'warning'
}

const Alert = (props: Props): ReactElement => {
  const { text, type } = props

  return (
    <div
      className={`usa-alert usa-alert--${type} usa-alert--no-icon`}
      role="alert"
    >
      <div className="usa-alert__body">
        <Trans className="usa-alert__text" i18nKey={text} />
      </div>
    </div>
  )
}

export default Alert
