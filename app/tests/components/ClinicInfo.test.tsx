import { render, screen } from '@testing-library/react'

import ClinicInfo from '@components/ClinicInfo'

import { testSnapshot } from '../helpers/sharedTests'

const testProps = {
  name: 'clinic name',
  streetAddress: 'clinic address',
  phone: 'clinic phone',
  isFormElement: undefined,
}

it('should match snapshot when it is a form element', () => {
  testSnapshot(<ClinicInfo {...testProps} isFormElement={true} />)
})

it('should match snapshot when it is not a form element', () => {
  testSnapshot(<ClinicInfo {...testProps} isFormElement={false} />)
})
