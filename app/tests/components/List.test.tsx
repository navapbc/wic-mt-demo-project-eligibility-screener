import { render } from '@testing-library/react'

import List from '@components/List'

const testProps = {
  i18nKeys: ['list item a', 'list item b', 'list item c'],
}

it('should match snapshot', () => {
  const { container } = render(<List {...testProps} />)
  expect(container).toMatchSnapshot()
})
