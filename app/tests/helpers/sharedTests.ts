import { act, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import mockRouter from 'next-router-mock'
import { ReactElement } from 'react'
import renderer from 'react-test-renderer'

export function testSnapshot(element: ReactElement) {
  const tree = renderer.create(element).toJSON()
  expect(tree).toMatchSnapshot()
}

export async function testAccessibility(element: ReactElement) {
  const { container } = render(element)

  // Must call axe() like this to satisfy react testing.
  let results
  await act(async () => {
    results = await axe(container)
  })

  expect(results).toHaveNoViolations()
}

export function testActionButtonReviewMode(
  element: ReactElement,
  route: string
) {
  // Set the path to review mode.
  act(() => {
    mockRouter.setCurrentUrl(`${route}?mode=review`)
  })
  render(element)

  const button = screen.getByRole('button', { name: /Update/i })
  expect(button).toBeInTheDocument()
}
