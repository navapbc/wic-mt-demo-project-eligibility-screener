import { NextRouter } from 'next/router'

import { SessionData } from '@src/types'
import {
  isValidChooseClinic,
  isValidContact,
  isValidEligibility,
  isValidIncome,
} from '@utils/dataValidation'

const pageFlow = [
  '/',
  '/how-it-works',
  '/eligibility',
  '/income',
  '/choose-clinic',
  '/contact',
  '/review',
  '/confirmation',
]

export function getBackRoute(
  currentPath: string,
  session: SessionData | ((value: SessionData) => void)
): string {
  const position = pageFlow.indexOf(currentPath)

  // Check for edge cases first.
  // /other-benefits always routes back to /eligibility
  if (currentPath === '/other-benefits') {
    return '/eligibility'
  }
  // There are no back buttons on / or /confirmation, so return empty string.
  else if (currentPath === '/' || currentPath === '/confirmation') {
    return ''
  }
  // /choose-clinic has different behavior depending on user data.
  else if (currentPath === '/choose-clinic') {
    // Typescript believes it's possible for session to be the function:
    // `(value: SessionData) => void`. If this actually happens at runtime, we
    // throw an error.
    if (typeof session === 'function') {
      throw new Error('Back link error: expected a session, but none was found')
    }
    // Otherwise, we can do actual checks against user data to get the correct route.
    else {
      // If the user has qualifying adjunctive criteria, they should skip the /income page.
      if (
        session.eligibility.adjunctive.length > 0 &&
        !session.eligibility.adjunctive.includes('none')
      ) {
        return '/eligibility'
      }
      // If the user has no qualifying adjunctive criteria, they should see the /income page.
      else {
        return '/income'
      }
    }
  } else {
    // Lookup the current path in the page flow and return the expected previous page.
    if (position > 0) {
      return pageFlow[position - 1]
    }
    // Unknown page! It probably doesn't have a back link.
    else {
      return ''
    }
  }
}

export function hasRoutingIssues(
  router: NextRouter,
  session: SessionData | ((value: SessionData) => void)
) {
  const pass = {
    error: false,
    cause: '',
  }
  // These pages have restricted access based on user data.
  // All other pages have no routing issues.
  const restrictedPages = ['/income', '/choose-clinic', '/contact', '/review']
  if (!restrictedPages.includes(router.pathname)) {
    return pass
  } else {
    // Same as getBackLink(), typescript warns that session might be a function.
    if (typeof session === 'function') {
      throw new Error('Back link error: expected a session, but none was found')
    }
    // If it's not, handle each restricted page.
    else {
      switch (router.pathname) {
        case '/review':
          if (!isValidContact(session.contact)) {
            return {
              error: true,
              cause: 'contact',
            }
          }
        // falls through
        case '/contact':
          if (!isValidChooseClinic(session.chooseClinic)) {
            return {
              error: true,
              cause: 'choose-clinic',
            }
          }
        // falls through
        case '/choose-clinic':
          if (
            session.eligibility.adjunctive.includes('none') &&
            !isValidIncome(session.income)
          ) {
            return {
              error: true,
              cause: 'income',
            }
          }
        // falls through
        case '/income':
          if (!isValidEligibility(session.eligibility)) {
            return {
              error: true,
              cause: 'eligibility',
            }
          }
        // falls through
        default:
          return pass
      }
    }
  }
}
