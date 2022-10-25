import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

export type AlertTypes = 'error' | 'info' | 'success' | 'warning'

export type AlertProps = {
  alertBody: string
  type: AlertTypes
  icon?: boolean
}

export const Alert = (props: AlertProps): ReactElement => {
  const { alertBody, type, icon } = props

  return (
    <div
      className={`usa-alert usa-alert--${type} ${
        icon ? '' : 'usa-alert--no-icon'
      }`}
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
