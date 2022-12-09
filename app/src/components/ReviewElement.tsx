import { ReactElement } from 'react'

import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type ReviewElementProps = {
  labelKey: I18nKey
  children: ReactElement | string | null
}

const ReviewElement = (props: ReviewElementProps) => {
  const { labelKey, children } = props

  return (
    <div className="review-element margin-bottom-3">
      <dt>
        <strong>
          <TransLine i18nKey={labelKey} />
        </strong>
      </dt>
      <dd className="margin-left-0">{children}</dd>
    </div>
  )
}

export default ReviewElement
