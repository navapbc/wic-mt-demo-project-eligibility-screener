import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

import ButtonLink from '@components/ButtonLink'
import ReviewElement, {ReviewElementProps } from '@components/ReviewElement'

type ReviewCollectionProps = {
  headerKey: string
  reviewElements: ReviewElementProps[]
  editable: boolean
  editHref: string
}

const ReviewCollection = (props: ReviewCollectionProps): ReactElement => {
  const { headerKey, reviewElements, editable = false, editHref = '' } = props

  return (
    <div className="review-collection">
      <h3>
        <Trans i18nKey={headerKey} />
        {editable && (
          <ButtonLink labelKey="edit" href={editHref} style="unstyled" />
        )}
      </h3>
      <dl>
        {reviewElements.map((element: ReviewElementProps, index: number) => (
          <ReviewElement key={index} {...element}/>
        ))}
      </dl>
    </div>
  )
}

export default ReviewCollection
