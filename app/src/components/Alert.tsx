import { ReactElement } from 'react'
import { Trans } from 'next-i18next'

type Props = {
  alertBody: string
  type: 'error' | 'info' | 'success' | 'warning'
  icon?: boolean
}

const Alert = (props: Props): ReactElement => {
  const { alertBody, type, icon } = props

  return (
    <div
      className={`usa-alert usa-alert--${type} ${icon ? '' : 'usa-alert--no-icon'}`}
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
