import { ReactElement } from 'react'

import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type AlertTypes = 'error' | 'info' | 'success' | 'warning'

export type AlertProps = {
  alertBody: I18nKey
  type: AlertTypes
  icon?: boolean
  slim?: boolean
}

export const Alert = (props: AlertProps): ReactElement => {
  const { alertBody, type, icon, slim } = props

  const classNames = `usa-alert usa-alert--${type} ${
    icon ? '' : 'usa-alert--no-icon'
  } ${slim ? 'usa-alert--slim' : ''}`

  return (
    <div className={classNames.trim()} role="alert">
      <div className="usa-alert__body">
        <p className="usa-alert__text">
          <TransLine i18nKey={alertBody} />
        </p>
      </div>
    </div>
  )
}

export default Alert
