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
        <p
          className="usa-alert__text"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  )
}

export default Alert
