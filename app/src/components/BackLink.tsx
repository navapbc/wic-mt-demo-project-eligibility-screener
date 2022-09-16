import { useTranslation } from 'next-i18next'
import React from 'react'

import StyledLink from '@components/StyledLink'

export interface BackLinkProps {
  href: string
}

export const BackLink: React.FC<BackLinkProps> = ({ href }) => {
  const { t } = useTranslation('common')
  return <StyledLink href={href} text={t('backlinkText')} />
}

export default BackLink
