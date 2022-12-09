import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type AlertTypes = 'error' | 'info' | 'success' | 'warning'

export type AlertProps = {
  alertBody: I18nKey
  type: AlertTypes
  icon?: boolean
}

export const Alert = (props: AlertProps) => {
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
          <TransLine i18nKey={alertBody} />
        </p>
      </div>
    </div>
  )
}

export default Alert
