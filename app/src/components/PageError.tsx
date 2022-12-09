import Alert from '@components/Alert'

import { i18nKey } from '@src/types'

export type PageErrorProps = {
  alertBody: i18nKey
}

export const PageError = (props: PageErrorProps) => {
  const { alertBody } = props
  return (
    <div className="margin-bottom-3">
      <Alert alertBody={alertBody} type="error" icon={true} />
    </div>
  )
}

export default PageError
