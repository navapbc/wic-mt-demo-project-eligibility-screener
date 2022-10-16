import { Trans } from 'next-i18next'
import React, { MouseEvent, ReactElement } from 'react'

type Props = {
  disabled?: boolean
  labelKey: string
  style?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

// Next.js requires forwarding refs if this functional component might
// be a child component of next/link. For more info, see
// https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component
const Button = React.forwardRef(
  (props: Props, ref: React.LegacyRef<HTMLButtonElement>): ReactElement => {
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
        ref={ref}
      >
        <Trans i18nKey={labelKey} />
      </button>
    )
  }
)

// Explicitly set the display name since we're using a forwardRef.
Button.displayName = 'Button'

export default Button
