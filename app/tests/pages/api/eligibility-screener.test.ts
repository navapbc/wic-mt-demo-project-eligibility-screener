import mockEnv from 'mocked-env'
import { createMocks } from 'node-mocks-http'

import handler from '@pages/api/eligibility-screener'

import { getEmptyMockSession, getMockSessionData } from '../../helpers/mockData'

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
    body: mockSession,
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
    body: { foo: 'bar' },
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
    body: mockSession,
  })

  await handler(req, res)
  expect(res._getStatusCode()).toBe(500)

  const responseBody = JSON.parse(res._getData())
  expect(responseBody.success).toBe(false)
  expect(responseBody.error).toBe('Invalid data')
})

it('should return 500 if missing env var for API_AUTH_TOKEN', async () => {})
it('should return 500 if API connection fails', async () => {})
it('should return 500 if API endpoint returns errors', async () => {})

// // Mock process.env
// const restore = mockEnv({
//   API_URL: goodUrl,
// })

// const data = await queryApiGateway(goodRequest, goodUniqueNumber)

// expect(data).toStrictEqual(mockedResponse)
// expect(fetch).toHaveBeenCalledTimes(1)

// // Restore env vars
// restore()
