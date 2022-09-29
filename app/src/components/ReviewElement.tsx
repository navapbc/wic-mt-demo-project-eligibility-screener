import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

export type ReviewElementProps = {
  labelKey: string
  children: ReactElement | null
}

const ReviewElement = (props: ReviewElementProps): ReactElement => {
  const { labelKey, children } = props

  return (
    <div className="review-element margin-bottom-3">
      <dt>
        <strong>
          <Trans i18nKey={labelKey} />
        </strong>
      </dt>
      <dd className="margin-left-0">{children}</dd>
    </div>
  )
}

export default ReviewElement
