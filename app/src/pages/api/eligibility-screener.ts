/**
 * When the user clicks "submit" on /review, we make a client-side call to this next.js
 * API endpoint. This API endpoint prepares the data to be sent on to an external api
 * (specifically this one: https://github.com/navapbc/wic-mt-demo-project-mock-api).
 * This API handles building the body, using fetch() to connect to the mock API, and
 * calling the mock API's endpoint.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

import { SessionData } from '@src/types'
import { isValidSession } from '@utils/dataValidation'
import { buildSubmission } from '@utils/submission'

export type ApiResponse = {
  status_code: number
}

export type EligibilityScreenerResponse = {
  success: boolean
  error: string
  errorDetails: string | ApiResponse
}

export type EligibilityScreenerBody = {
  session: SessionData
  translatedCategorical: string[]
  translatedAdjunctive: string[]
}

// Throw an error if the env var API_HOST is missing or not set.
function buildApiUrl() {
  if (process.env.API_HOST) {
    return `${process.env.API_HOST}/v1/eligibility-screener`
  } else {
    throw new Error('Missing API url')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EligibilityScreenerResponse>
) {
  // The only allowed method for this endpoint is POST.
  if (req.method === 'POST') {
    // Cast req.body to SessionData. We will explicitly check the object
    // validates in isValidSession().
    const castBody = req.body as EligibilityScreenerBody
    const session = castBody.session

    if (!isValidSession(session)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid data',
        errorDetails: '',
      })
    }

    // Construct the request body.
    session.eligibility.categorical = castBody.translatedCategorical
    session.eligibility.adjunctive = castBody.translatedAdjunctive
    const submission = buildSubmission(session)

    // Build the API url.
    let apiUrl: string
    try {
      apiUrl = buildApiUrl()
    } catch (e: unknown) {
      // If building the API url throws an error, the endpoint should return 500.
      const error = e as Error
      return res.status(500).json({
        success: false,
        error: 'Configuration error',
        errorDetails: error.message,
      })
    }

    // Wrap fetch() in a try ... catch in case there is an error attempting
    // to reach the API.
    try {
      // Make the API call.
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: {
          'Content-type': 'application/json',
          // Provide the API token.
          'X-Auth': process.env.API_AUTH_TOKEN || '',
        },
      })

      // Get the API call results.
      const responseBody = (await response.json()) as ApiResponse

      // If the API call status is NOT 201, then pass through the status code
      // and return an error message.
      if (responseBody.status_code !== 201) {
        return res.status(responseBody.status_code).json({
          success: false,
          error: 'API endpoint returned errors',
          errorDetails: responseBody,
        })
      }

      // Otherwise, the API call was a success and the database record was created!
      // Redirect to /confirmation.
      else {
        return res
          .status(responseBody.status_code)
          .json({ success: true, error: '', errorDetails: '' })
      }
    } catch (e: unknown) {
      // If there is an error attempting to reach the API, the endpoint should
      // return 500.
      const error = e as Error
      return res.status(500).json({
        success: false,
        error: 'API connection error',
        errorDetails: error.message,
      })
    }
  }

  // All non-POST methods for this endpoint return an error.
  else {
    return res
      .status(500)
      .json({ success: false, error: 'GET is not allowed', errorDetails: '' })
  }
}
