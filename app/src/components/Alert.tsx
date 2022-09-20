import { Trans } from 'next-i18next'
import { ReactElement } from 'react'
import { Trans } from 'next-i18next'

type Props = {
  alertBody: string
  type: 'error' | 'info' | 'success' | 'warning'
}

const Alert = (props: Props): ReactElement => {
  const { alertBody, type } = props

  return (
    <div
      className={`usa-alert usa-alert--${type} usa-alert--no-icon`}
      role="alert"
    >
      <div className="usa-alert__body">
        <p className="usa-alert__text">
          <Trans i18nKey={alertBody} />
        </p>
      </div>
    </div>
  )
}

export default Alert
