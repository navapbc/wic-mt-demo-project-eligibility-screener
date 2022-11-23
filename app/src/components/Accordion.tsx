import { Trans } from 'next-i18next'
import { ReactElement, useState } from 'react'

import { I18nKey } from '@src/types'

export type AccordionProps = {
  bodyKey: I18nKey
  headerKey: I18nKey
}

const Accordion = (props: AccordionProps): ReactElement => {
  const { bodyKey, headerKey } = props
  const [isExpanded, setExpanded] = useState(false)

  const handleClick = () => {
    setExpanded(!isExpanded)
  }

  return (
    <div className="usa-accordion usa-accordion--bordered">
      <h3 className="usa-accordion__heading">
        <button
          aria-controls="b-a1"
          aria-expanded={isExpanded}
          className="usa-accordion__button"
          onClick={handleClick}
          type="button"
        >
          <Trans i18nKey={headerKey} />
        </button>
      </h3>
      <div className="usa-accordion__content" hidden={!isExpanded} id="b-a1">
        <Trans i18nKey={bodyKey} />
      </div>
    </div>
  )
}

export default Accordion
