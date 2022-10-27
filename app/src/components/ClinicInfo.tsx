import { ReactElement } from 'react'

export type ClinicInfoProps = {
  name: string
  streetAddress: string
  phone: string
  isFormElement?: boolean
}

export const ClinicInfo = (props: ClinicInfoProps): ReactElement => {
  const { name, streetAddress, phone, isFormElement = false } = props

  const formClass = isFormElement ? 'usa-checkbox__label-description' : ''

  return (
    <div className="clinic-info">
      <div className="clinic-name">{name}</div>
      <div className={formClass}>
        <div className="clinic-street-address">{streetAddress}</div>
        <div className="clinic-phone">{phone}</div>
      </div>
    </div>
  )
}

export default ClinicInfo
