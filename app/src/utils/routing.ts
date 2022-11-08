import { UrlObject } from 'url'

import { SessionData } from '@src/types'
import {
  isValidEligibility,
  isValidIncome,
  isValidSession,
} from '@utils/dataValidation'

interface RestrictedPages {
  [key: string]: string[]
}

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

export function getForwardRoute(
  pathname: string,
  reviewMode: boolean,
  session: SessionData | ((value: SessionData) => void)
): UrlObject | string {
  const position = pageFlow.indexOf(pathname)

  // Check for simple review mode cases.
  const reviewModePages = ['/income', '/choose-clinic', '/contact']
  if (reviewMode && reviewModePages.includes(pathname)) {
    return '/review'
  }

  // Check for edge cases.
  // /other-benefits always routes forward to /
  if (pathname === '/other-benefits') {
    return '/'
  }
  // There is no action button on /confirmation, so return empty string.
  else if (pathname === '/confirmation') {
    return ''
  }
  // /eligibility has different behaviour depending on user data.
  else if (pathname === '/eligibility') {
    // Typescript believes it's possible for session to be the function:
    // `(value: SessionData) => void`. If this actually happens at runtime, we
    // throw an error.
    if (typeof session === 'function') {
      throw new Error(
        'Forward route error: expected a session, but none was found'
      )
    }
    // Otherwise, we can do actual checks against user data to get the correct route.
    else {
      if (
        !isValidEligibility(session.eligibility) ||
        session.eligibility.residential === 'no' ||
        session.eligibility.categorical.includes('none')
      ) {
        return '/other-benefits'
      } else if (session.eligibility.adjunctive.includes('none')) {
        if (reviewMode) {
          if (!isValidIncome(session.income)) {
            return { pathname: '/income', query: { mode: 'review' } }
          } else {
            return '/review'
          }
        } else {
          return '/income'
        }
      } else {
        if (reviewMode) {
          return '/review'
        } else {
          return '/choose-clinic'
        }
      }
    }
  }

  // Otherwise handle simple cases.
  if (position !== -1) {
    return pageFlow[position + 1]
  }
  // Unknown page! It probably doesn't have an action button.
  else {
    return ''
  }
}

export function getBackRoute(
  pathname: string,
  session: SessionData | ((value: SessionData) => void)
): string {
  const position = pageFlow.indexOf(pathname)

  // Check for edge cases first.
  // /other-benefits always routes back to /eligibility
  if (pathname === '/other-benefits') {
    return '/eligibility'
  }
  // There are no back buttons on / or /confirmation, so return empty string.
  else if (pathname === '/' || pathname === '/confirmation') {
    return ''
  }
  // /choose-clinic has different behavior depending on user data.
  else if (pathname === '/choose-clinic') {
    // Typescript believes it's possible for session to be the function:
    // `(value: SessionData) => void`. If this actually happens at runtime, we
    // throw an error.
    if (typeof session === 'function') {
      throw new Error(
        'Back route error: expected a session, but none was found'
      )
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
  pathname: string,
  session: SessionData | ((value: SessionData) => void)
) {
  const pass = {
    hasIssues: false,
    showError: false,
    redirect: '',
  }
  // These pages have restricted access based on user data.
  // Order matters in these arrays because it will determine which page the
  // user is redirected to.
  const restrictedPages: RestrictedPages = {
    '/income': ['eligibility'],
    '/choose-clinic': ['eligibility', 'income'],
    '/contact': ['eligibility', 'income', 'choose-clinic'],
    '/review': ['eligibility', 'income', 'choose-clinic', 'contact'],
    '/confirmation': [],
  }

  if (!Object.keys(restrictedPages).includes(pathname)) {
    return pass
  }

  // Same as getBackLink(), typescript warns that session might be a function.
  if (typeof session === 'function') {
    throw new Error('Routing error: expected a session, but none was found')
  }

  // Handle special edge case for /confirmation, which should redirect
  // to the index page and not display any errors.
  if (pathname === '/confirmation') {
    if (!isValidSession(session)) {
      return {
        hasIssues: true,
        showError: false,
        redirect: '/',
      }
    } else {
      return pass
    }
  }

  // If it's not, handle each restricted page.
  for (let i = 0, len = restrictedPages[pathname].length; i < len; i++) {
    const check = restrictedPages[pathname][i]
    if (!isValidSession(session, check)) {
      return {
        hasIssues: true,
        showError: true,
        redirect: check,
      }
    }
  }

  // If none of the other checks failed, pass.
  return pass
}
