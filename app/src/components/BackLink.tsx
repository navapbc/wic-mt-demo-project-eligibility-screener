import { useTranslation } from 'next-i18next'
import { ReactElement } from 'react'

import StyledLink from '@components/StyledLink'

export interface BackLinkProps {
  href: string
}

export const BackLink = (props: BackLinkProps): ReactElement => {
  const { href } = props

  const { t } = useTranslation('common')
  return <StyledLink href={href} text={t('backlinkText')} />
}

export default BackLink
