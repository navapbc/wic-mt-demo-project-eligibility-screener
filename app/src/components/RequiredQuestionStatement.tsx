import { Trans } from 'next-i18next'
import React from 'react'

export const RequiredQuestionStatement: React.FC = () => {
  return (
    <p>
      <Trans i18nKey="asterisk" /> (
      <abbr className="usa-hint usa-hint--required">*</abbr>).
    </p>
  )
}

export default RequiredQuestionStatement
