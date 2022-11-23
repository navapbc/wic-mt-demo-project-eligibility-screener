import { Trans, useTranslation } from 'next-i18next'
import { ReactElement } from 'react'

import { I18nKey } from '@src/types'

export type TransLineProps = {
  i18nKey: I18nKey
}

export const TransLine = (props: TransLineProps): ReactElement => {
  const { i18nKey } = props
  const { t } = useTranslation('common')

  let transLinks: ReactElement[] | null = null

  // If the i18nKey ends in `.text`, that indicates that it has a corresponding
  // `.links` sibling that is an ordered array of hrefs. We retrieve the array from i18next
  // and construct an array of empty `<a></a>` tags to pass to the <TransLine> component
  // which will interpolate the links into the translation string.
  if (/\.text$/.test(i18nKey)) {
    const linkArray: string[] = t(i18nKey.replace('.text', '.links'), {
      returnObjects: true,
    })

    transLinks = linkArray.map((href: string) => {
      if (/^\//.test(href)) {
        // We can't use <StyledLink> because <TransLine> doesn't know what to do with it.
        return <a href={href} className="usa-link" key={href}></a>
      } else {
        return (
          <a
            href={href}
            className="usa-link usa-link--external"
            target="_blank"
            rel="noopener noreferrer"
            key={href}
          ></a>
        )
      }
    })
  }

  return <Trans i18nKey={i18nKey}>{transLinks}</Trans>
}

export default TransLine
