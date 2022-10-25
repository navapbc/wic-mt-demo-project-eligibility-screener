import { Trans } from 'next-i18next'
import { ReactElement } from 'react'
import { UrlObject } from 'url'

import ButtonLink from '@components/ButtonLink'
import ReviewElement, { ReviewElementProps } from '@components/ReviewElement'

export type ReviewCollectionProps = {
  headerKey: string
  reviewElements: ReviewElementProps[]
  editable: boolean
  editHref: UrlObject | string
  firstElement?: boolean
}

const ReviewCollection = (props: ReviewCollectionProps): ReactElement => {
  const {
    headerKey,
    reviewElements,
    editable = false,
    editHref = '',
    firstElement = false,
  } = props

  const marginTop = firstElement ? 'margin-top-3' : 'margin-top-6'

  return (
    <div className={`review-collection ${marginTop} border-bottom-1px`}>
      <h2>
        <Trans i18nKey={headerKey} />
        {editable && (
          <div className="float-right">
            <ButtonLink labelKey="edit" href={editHref} style="unstyled" />
          </div>
        )}
      </h2>
      <dl className="margin-bottom-2">
        {reviewElements.map((element: ReviewElementProps, index: number) => (
          <ReviewElement key={index} {...element} />
        ))}
      </dl>
    </div>
  )
}

export default ReviewCollection
