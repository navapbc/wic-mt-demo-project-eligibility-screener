import { render, screen } from '@testing-library/react'

import ClinicInfo from '@components/ClinicInfo'

const testProps = {
  name: 'clinic name',
  streetAddress: 'clinic address',
  phone: 'clinic phone',
  isFormElement: undefined,
}

it('should match snapshot when it is a form element', () => {
  const { container } = render(
    <ClinicInfo {...testProps} isFormElement={true} />
  )
  expect(container).toMatchSnapshot()
})

it('should match snapshot when it is not a form element', () => {
  const { container } = render(
    <ClinicInfo {...testProps} isFormElement={false} />
  )
  expect(container).toMatchSnapshot()
})
