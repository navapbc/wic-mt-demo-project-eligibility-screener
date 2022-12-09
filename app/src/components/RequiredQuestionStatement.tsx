import TransLine from '@components/TransLine'

export const RequiredQuestionStatement = () => {
  return (
    <p>
      <TransLine i18nKey="asterisk" /> (
      <abbr className="usa-hint usa-hint--required">*</abbr>).
    </p>
  )
}

export default RequiredQuestionStatement
