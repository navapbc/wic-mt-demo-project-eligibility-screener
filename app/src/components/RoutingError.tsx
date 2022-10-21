import { ReactElement } from 'react'

import Alert from '@components/Alert'

export const RoutingError = (): ReactElement => {
  return (
    <div className="margin-bottom-3">
      <Alert alertBody="routingError" type="error" icon={true} />
    </div>
  )
}

export default RoutingError
