import type { NextApiRequest, NextApiResponse } from 'next'

import { buildSubmission } from '@utils/submission'

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
  res: NextApiResponse
) {
  // The only allowed method for this endpoint is POST.
  if (req.method === 'POST') {
    // Construct the request body.
    const submission = buildSubmission(req.body)

    // Build the API url.
    let apiUrl: string
    try {
      apiUrl = buildApiUrl()
    } catch (e: unknown) {
      // If building the API url throws an error, the endpoint should return 500.
      const error = e as Error
      return res
        .status(500)
        .json({ error: 'Configuration error', errorDetails: error.message })
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
      const responseBody: object = (await response.json()) as object

      const castStatusCode = responseBody.status_code as number

      // If the API call status is NOT 201, then pass through the status code
      // and return an error message.
      if (castStatusCode !== 201) {
        return res.status(castStatusCode).json({
          error: 'API endpoint returned errors',
          errorDetails: responseBody,
        })
      }

      // Otherwise, the API call was a success and the database record was created!
      // Redirect to /confirmation.
      else {
        return res.status(castStatusCode).json({ success: true })
      }
    } catch (e: unknown) {
      // If there is an error attempting to reach the API, the endpoint should
      // return 500.
      const error = e as Error
      return res
        .status(500)
        .json({ error: 'API connection error', errorDetails: error.message })
    }
  }

  // All non-POST methods for this endpoint return an error.
  else {
    return res.status(500).json({ error: 'GET is not allowed' })
  }
}
