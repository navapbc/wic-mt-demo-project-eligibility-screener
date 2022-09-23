import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

type Props = {
  disabled?: boolean
  labelKey: string
  style?: string
  onClick?: () => {}
}

const Button = (props: Props): ReactElement => {
  const { disabled, labelKey, style, onClick } = props

  let buttonStyle = ''
  if (style) {
    buttonStyle = `usa-button--${style} margin-top-1`
  } else {
    buttonStyle = 'margin-top-6'
  }

  return (
    <button
      className={`usa-button usa-button--small display-block ${buttonStyle}`}
      disabled={disabled}
      onClick={onClick}
    >
      <Trans i18nKey={labelKey} />
    </button>
  )
}

export default Button
