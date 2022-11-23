import { ReactElement } from 'react'

import TransLine from '@components/TransLine'

export const RequiredQuestionStatement = (): ReactElement => {
  return (
    <p>
      <TransLine i18nKey="asterisk" /> (
      <abbr className="usa-hint usa-hint--required">*</abbr>).
    </p>
  )
}

export default RequiredQuestionStatement
