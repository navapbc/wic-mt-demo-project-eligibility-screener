import { enableFetchMocks } from 'jest-fetch-mock'
import mockEnv from 'mocked-env'
import { createMocks } from 'node-mocks-http'

import handler from '@pages/api/eligibility-screener'

import { getEmptyMockSession, getMockSessionData } from '../../helpers/mockData'

/**
 * Setup tests: specifically to mock fetch().
 */
enableFetchMocks()
beforeEach(() => {
  fetchMock.dontMock()
})

/**
 * Begin tests.
 */
it('should return 500 for GET method', async () => {
  const { req, res } = createMocks({
    method: 'GET',
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('GET is not allowed')
})

it('should return 500 if invalid session data is supplied', async () => {
  const mockSession = getEmptyMockSession()
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      session: mockSession,
      translatedCategorical: mockSession.eligibility.categorical,
      translatedAdjunctive: mockSession.eligibility.adjunctive,
    },
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('Invalid data')
})

it('should return 500 if malformed session data is supplied', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { session: { foo: 'bar' } },
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('Invalid data')
})

it('should return 500 if missing env var for API_HOST', async () => {
  const mockSession = getMockSessionData()
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      session: mockSession,
      translatedCategorical: mockSession.eligibility.categorical,
      translatedAdjunctive: mockSession.eligibility.adjunctive,
    },
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('Configuration error')
})

it('should return 401 if missing env var for API_AUTH_TOKEN', async () => {
  // Mock process.env
  const restore = mockEnv({
    API_HOST: 'dummyApi',
  })
  const mockSession = getMockSessionData()
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      session: mockSession,
      translatedCategorical: mockSession.eligibility.categorical,
      translatedAdjunctive: mockSession.eligibility.adjunctive,
    },
  })

  const missingAuthToken = {
    data: null,
    errors: [],
    message: 'No authorization token provided',
    status_code: 401,
  }

  fetchMock.doMockOnce(JSON.stringify(missingAuthToken))

  await handler(req, res)
  expect(res._getStatusCode()).toBe(401)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('API endpoint returned errors')

  restore()
})

it('should return 500 if API connection fails', async () => {
  // Mock process.env
  const restore = mockEnv({
    API_HOST: 'set',
  })
  const mockSession = getMockSessionData()
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      session: mockSession,
      translatedCategorical: mockSession.eligibility.categorical,
      translatedAdjunctive: mockSession.eligibility.adjunctive,
    },
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('API connection error')

  restore()
})

it('should return 400 if API endpoint returns errors', async () => {
  // Mock process.env
  const restore = mockEnv({
    API_HOST: 'dummyApi',
  })
  const mockSession = getMockSessionData()
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      session: mockSession,
      translatedCategorical: mockSession.eligibility.categorical,
      translatedAdjunctive: mockSession.eligibility.adjunctive,
    },
  })

  const dataValidationError = {
    data: null,
    errors: [
      {
        field: 'household_size',
        message: "'something' is not of type 'integer'",
        rule: 'integer',
        type: 'type',
        value: 'str',
      },
    ],
    message: 'Request Validation Error',
    status_code: 400,
  }

  fetchMock.doMockOnce(JSON.stringify(dataValidationError))

  await handler(req, res)
  expect(res._getStatusCode()).toBe(400)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('API endpoint returned errors')

  restore()
})
