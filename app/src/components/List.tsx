import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

export type ListProps = {
  i18nKeys: string[]
}

export const List = (props: ListProps): ReactElement => {
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
