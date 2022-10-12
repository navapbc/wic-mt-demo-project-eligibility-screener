import type { EligibilityData, SessionData } from '@customTypes/common'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { axe } from 'jest-axe'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'
import singletonRouter, { useRouter } from 'next/router'
import { useState } from 'react'
import renderer from 'react-test-renderer'

import Eligibility from '@pages/eligibility'

/**
 * Test setup
 */

// Mock the nextjs router
jest.mock('next/router', () => require('next-router-mock'))
// This is needed for mocking 'next/link':
jest.mock('next/dist/client/router', () => require('next-router-mock'))
// Temporary workaround for all next.js 12.2.0+
// See active issue: https://github.com/scottrippey/next-router-mock/issues/58
jest.mock('next/dist/shared/lib/router-context', () => {
  const { createContext } = require('react')
  const router = require('next-router-mock').default
  const RouterContext = createContext(router)
  return { RouterContext }
})

// Mock the session
let mockSession: SessionData
const emptyMockEligibility: EligibilityData = {
  residential: '',
  categorical: [],
  previouslyEnrolled: '',
  adjunctive: [],
}
const emptyMockSession: SessionData = {
  clinic: undefined,
  contact: {
    firstName: '',
    lastName: '',
    phone: '',
    comments: '',
  },
  eligibility: cloneDeep(emptyMockEligibility),
}
const setMockSession = jest.fn()

/**
 * Begin tests
 */

describe('Eligibility', () => {
  beforeEach(() => {
    // Set the router before each test.
    act(() => {
      mockRouter.setCurrentUrl('/eligibility')
    })

    // Reset the mock session before each test.
    mockSession = cloneDeep(emptyMockSession)
  })

  it('should match full page snapshot', () => {
    const tree = renderer
      .create(<Eligibility session={mockSession} setSession={setMockSession} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(
      <Eligibility session={mockSession} setSession={setMockSession} />
    )

    // Must call axe() like this to satisfy react testing.
    let results
    await act(async () => {
      results = await axe(container)
    })

    expect(results).toHaveNoViolations()
  })

  describe('Action button initial behavior', () => {
    const combinations = [
      ['no values are set', '', [], '', []],
      ['residential is not set', '', ['anything'], 'anything', ['anything']],
      ['categorical is not set', 'anything', [], 'anything', ['anything']],
      [
        'previouslyEnrolled is not set',
        'anything',
        ['anything'],
        '',
        ['anything'],
      ],
      ['adjunctive is not set', 'anything', ['anything'], 'anything', []],
    ]
    it.each(combinations)(
      'should be disabled if %s',
      (
        description,
        residential,
        categorical,
        previouslyEnrolled,
        adjunctive
      ) => {
        // Set the initial mock session values
        mockSession.eligibility.residential = residential as string
        mockSession.eligibility.categorical = categorical as string[]
        mockSession.eligibility.previouslyEnrolled =
          previouslyEnrolled as string
        mockSession.eligibility.adjunctive = adjunctive as string[]
        render(
          <Eligibility session={mockSession} setSession={setMockSession} />
        )

        // Check the button is disabled.
        const button = screen.getByRole('button', { name: /Continue/i })
        expect(button).toBeDisabled()
      }
    )

    it('should be enabled if all requirements are met', () => {
      // Set the initial mock session values
      mockSession.eligibility.residential = 'anything'
      mockSession.eligibility.categorical = ['anything']
      mockSession.eligibility.previouslyEnrolled = 'anything'
      mockSession.eligibility.adjunctive = ['anything']
      render(<Eligibility session={mockSession} setSession={setMockSession} />)

      // Check the button is enabled.
      const button = screen.getByRole('button', { name: /Continue/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe('Action button interactive behavior', () => {
    it('should stay disabled until all requirements are met and re-disable if reqirements are unmet', () => {
      render(<Eligibility session={mockSession} setSession={setMockSession} />)
      const button = screen.getByRole('button', { name: /Continue/i })
      expect(button).toBeDisabled()

      // Select a residental option.
      const residential = screen.getAllByRole('radio', { name: /Yes/i })[0]
      expect(residential).not.toBeChecked()
      fireEvent.click(residential)
      expect(residential).toBeChecked()
      expect(button).toBeDisabled()

      // Select a categorical option.
      const categorical = screen.getByRole('checkbox', {
        name: /I'm pregnant/i,
      })
      expect(categorical).not.toBeChecked()
      fireEvent.click(categorical)
      expect(categorical).toBeChecked()
      expect(button).toBeDisabled()

      // Select a previouslyEnrolled option.
      const previouslyEnrolled = screen.getAllByRole('radio', {
        name: /Yes/i,
      })[1]
      expect(previouslyEnrolled).not.toBeChecked()
      fireEvent.click(previouslyEnrolled)
      expect(previouslyEnrolled).toBeChecked()
      expect(button).toBeDisabled()

      // Select a adjunctive option.
      const adjunctive = screen.getByRole('checkbox', { name: /FDPIR/i })
      expect(adjunctive).not.toBeChecked()
      fireEvent.click(adjunctive)
      expect(adjunctive).toBeChecked()
      // The button should finally be enabled.
      expect(button).not.toBeDisabled()

      // De-select a categorical option.
      fireEvent.click(categorical)
      expect(categorical).not.toBeChecked()
      // The button should not be disabled again.
      expect(button).toBeDisabled()

      // Re-select a categorical option.
      fireEvent.click(categorical)
      expect(categorical).toBeChecked()
      expect(button).not.toBeDisabled()

      // De-select a adjunctive option.
      fireEvent.click(adjunctive)
      expect(adjunctive).not.toBeChecked()
      // The button should not be disabled again.
      expect(button).toBeDisabled()

      // Re-select a adjunctive option.
      fireEvent.click(adjunctive)
      expect(adjunctive).toBeChecked()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Action button review behavior', () => {
    it('should render differently in review mode', () => {
      // Set the path to review mode.
      act(() => {
        mockRouter.setCurrentUrl('/eligibility?mode=review')
      })
      render(<Eligibility session={mockSession} setSession={setMockSession} />)
      const button = screen.getByRole('button', { name: /Update/i })
      expect(button).toBeInTheDocument()
    })
  })
})

describe('Eligibility routing', () => {
  it('should route to /other-benefits by default', () => {
    act(() => {
      mockRouter.setCurrentUrl('/eligibility')
    })
    const filledSession = cloneDeep(mockSession)
    filledSession.eligibility = {
      residential: 'anything',
      categorical: ['anything'],
      previouslyEnrolled: 'anything',
      adjunctive: ['anything'],
    }
    render(<Eligibility session={filledSession} setSession={setMockSession} />)
    const button = screen.getByRole('button', { name: /Continue/i })
    act(() => {
      fireEvent.click(button)
    })

    expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
  })

  it('should route to /other-benefits if categorical includes none', () => {
    act(() => {
      mockRouter.setCurrentUrl('/eligibility')
    })
    const filledSession = cloneDeep(mockSession)
    filledSession.eligibility = {
      residential: 'yes',
      categorical: ['anything', 'none'],
      previouslyEnrolled: 'anything',
      adjunctive: ['anything'],
    }
    render(<Eligibility session={filledSession} setSession={setMockSession} />)
    const button = screen.getByRole('button', { name: /Continue/i })
    act(() => {
      fireEvent.click(button)
    })

    expect(singletonRouter).toMatchObject({ asPath: '/other-benefits' })
  })

  it('should route to /income if adjunctive includes none', () => {
    act(() => {
      mockRouter.setCurrentUrl('/eligibility')
    })
    const filledSession = cloneDeep(mockSession)
    filledSession.eligibility = {
      residential: 'yes',
      categorical: ['anything'],
      previouslyEnrolled: 'anything',
      adjunctive: ['anything', 'none'],
    }
    render(<Eligibility session={filledSession} setSession={setMockSession} />)
    const button = screen.getByRole('button', { name: /Continue/i })
    act(() => {
      fireEvent.click(button)
    })

    expect(singletonRouter).toMatchObject({ asPath: '/income' })
  })

  it('should route to /choose-clinic if adjunctive qualifies', () => {
    act(() => {
      mockRouter.setCurrentUrl('/eligibility')
    })
    const filledSession = cloneDeep(mockSession)
    filledSession.eligibility = {
      residential: 'yes',
      categorical: ['anything'],
      previouslyEnrolled: 'anything',
      adjunctive: ['anything'],
    }
    render(<Eligibility session={filledSession} setSession={setMockSession} />)
    const button = screen.getByRole('button', { name: /Continue/i })
    act(() => {
      fireEvent.click(button)
    })

    expect(singletonRouter).toMatchObject({ asPath: '/choose-clinic' })
  })
})
