import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('Displays the backend response', async () => {
    const response = 'Some backend response'

    fetchMock.mockResponseOnce(request => {
      expect(request.url === '/api')

      return Promise.resolve(response)
    })

    render(<App/>)
    await waitFor(() => {
      const text = screen.getByText(response)
      expect(text).toBeInTheDocument()
    })
  })
})