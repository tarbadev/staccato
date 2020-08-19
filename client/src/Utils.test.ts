import { request } from './Utils'

describe('request', () => {
  beforeEach(() => fetchMock.resetMocks())

  it('makes an api request with the given params', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: 'Something' }))

    await request({
      url: '/foo/bar',
      method: 'post',
      body: { baz: 'biz' },
    })

    expect(fetch).toHaveBeenCalledWith(
      '/foo/bar',
      {
        method: 'post',
        body: JSON.stringify({ baz: 'biz' }),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        url: '/foo/bar',
      },
    )
  })

  it('adds the method to be GET by default', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: 'Something' }))

    await request({ url: '/foo/bar' })

    expect(fetch).toHaveBeenCalledWith(
      '/foo/bar',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        url: '/foo/bar',
      },
    )
  })

  it('returns the result of the fetch when it succeeds', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: 'Something' }))
    return request({ url: '/foo/bar' }).then(result => expect(result).toEqual({ name: 'Something' }))
  })

  it('rejects the promise with an error when the response is an error', () => {
    fetchMock.mockResponseOnce('', { status: 404 })
    return request({ url: '/foo/bar' }).catch(e => expect(e.message).toEqual('Response Error: 404'))
  })
})
