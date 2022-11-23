import { ReactElement } from 'react'

import Alert from '@components/Alert'

import { I18nKey } from '@src/types'

export type PageErrorProps = {
  alertBody: I18nKey
}

export const PageError = (props: PageErrorProps): ReactElement => {
  const { alertBody } = props
  return (
    <div className="margin-bottom-3">
      <Alert alertBody={alertBody} type="error" icon={true} />
    </div>
  )
}

export default PageError
