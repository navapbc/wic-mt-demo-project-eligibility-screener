import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type ListProps = {
  i18nKeys: I18nKey[]
}

export const List = (props: ListProps) => {
  const { i18nKeys } = props

  return (
    <ul>
      {i18nKeys.map((key, index) => (
        <li key={index}>
          <TransLine i18nKey={key} />
        </li>
      ))}
    </ul>
  )
}

export default List
