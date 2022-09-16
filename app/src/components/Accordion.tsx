import { ReactElement, useState } from 'react'
import { Trans } from 'react-i18next'

type Props = {
  body: string
  header: string
}

const Accordion = (props: Props): ReactElement => {
  const { body, header } = props
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
          {header}
        </button>
      </h3>
      <div
        className="usa-accordion__content usa-prose"
        hidden={!isExpanded}
        id="b-a1"
      >
        <Trans i18nKey={body} />
      </div>
    </div>
  )
}

export default Accordion
