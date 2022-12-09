import { Trans } from 'next-i18next'

import { i18nKey } from '@src/types'

export type ListProps = {
  i18nKeys: i18nKey[]
}

export const List = (props: ListProps) => {
  const { i18nKeys } = props

  return (
    <ul>
      {i18nKeys.map((key, index) => (
        <li key={index}>
          <Trans i18nKey={key} />
        </li>
      ))}
    </ul>
  )
}

export default List
