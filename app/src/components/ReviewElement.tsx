import { Trans } from 'next-i18next'
import { ReactElement, ReactNode } from 'react'

type ReviewElementProps = {
  labelKey: string
  responseKeys: string[]
  isList: boolean
}

const ReviewElement = (props: ReviewElementProps): ReactElement => {
  const { labelKey, responseKeys, isList = false } = props

  let child: ReactElement
  if (isList) {
    child = responseKeys.map<ReactNode>((responseKey, index) => (
      <li key={index}>
        <Trans i18nKey={responseKey} />
      </li>
    ))
    child = <ul>{child}</ul>
  } else {
    child = <Trans i18nKey={responseKeys[0]} />
  }

  return (
    <div className="review-element margin-bottom-3">
      <dt>
        <strong>
          <Trans i18nKey={labelKey} />
        </strong>
      </dt>
      <dd className="margin-left-0">{child}</dd>
    </div>
  )
}

export default ReviewElement
