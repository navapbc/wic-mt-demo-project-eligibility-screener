import { Trans } from 'next-i18next'
import React, { MouseEvent } from 'react'

import { i18nKey } from '@src/types'

export const buttonStyleOptions = [
  'default',
  'unstyled',
  'secondary',
  'accent-cool',
  'accent-warm',
  'base',
  'outline',
  'big',
] as const

export type ButtonProps = {
  disabled?: boolean
  labelKey: i18nKey
  style?: typeof buttonStyleOptions[number]
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

// Next.js requires forwarding refs if this functional component might
// be a child component of next/link. For more info, see
// https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-functional-component
const Button = React.forwardRef(
  (props: ButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
    const { disabled, labelKey, style, onClick } = props

    let buttonStyle = ''
    // Set an additional check that style "default" is the same as '' empty string.
    // Used in storybook story.
    if (style && style !== 'default' && buttonStyleOptions.includes(style)) {
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
