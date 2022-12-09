import { Trans } from 'next-i18next'

export const RequiredQuestionStatement = () => {
  return (
    <p>
      <Trans i18nKey="asterisk" /> (
      <abbr className="usa-hint usa-hint--required">*</abbr>).
    </p>
  )
}

export default RequiredQuestionStatement
