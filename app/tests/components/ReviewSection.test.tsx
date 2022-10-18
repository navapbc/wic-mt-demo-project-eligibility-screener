import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import ReviewSection from '@components/ReviewSection'

import { setup } from '../helpers/setup'

/**
 * Test setup
 */

const route = '/review'

/**
 * Begin tests
 */

it('should not display edit buttons if it is not editable', () => {
  const { mockSession } = setup(route)
  render(<ReviewSection session={mockSession} editable={false} />)

  const buttons = screen.queryByRole('button', { name: /Edit/i })
  expect(buttons).not.toBeInTheDocument()
})

it('button should route to edit page for eligibility', async () => {
  const { mockSession, user } = setup(route)
  render(<ReviewSection session={mockSession} editable={true} />)

  const button = screen.getAllByRole('button', { name: /Edit/i })[0]
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/eligibility?mode=review' })
})

it('should route to edit page for choose clinic', async () => {
  const { mockSession, user } = setup(route)
  render(<ReviewSection session={mockSession} editable={true} />)

  const button = screen.getAllByRole('button', { name: /Edit/i })[1]
  await user.click(button)
  expect(singletonRouter).toMatchObject({
    asPath: '/choose-clinic?mode=review',
  })
})

it('should route to edit page for contact', async () => {
  const { mockSession, user } = setup(route)
  render(<ReviewSection session={mockSession} editable={true} />)

  const button = screen.getAllByRole('button', { name: /Edit/i })[2]
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/contact?mode=review' })
})

it('should route to edit page for income', async () => {
  const { mockSession, user } = setup(route)
  // Income section only displays if session.eligibility.adjunctive includes 'none'
  // and session.income.householdSize is not ''
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income.householdSize = '5'
  render(<ReviewSection session={mockSession} editable={true} />)
  const button = screen.getAllByRole('button', { name: /Edit/i })[1]
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/income?mode=review' })
})
