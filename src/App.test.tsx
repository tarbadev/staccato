import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('Displays the list of bundles', async () => {
    const bundle1 = 'Bundle 1';
    const bundle2 = 'Bundle 2';
    const bundle3 = 'Bundle 3';
    const response = [
      { name: bundle1 },
      { name: bundle2 },
      { name: bundle3 },
    ]

    fetchMock.mockResponseOnce(request => {
      expect(request.url === '/api/bundles')

      return Promise.resolve(JSON.stringify(response))
    })

    render(<App/>)

    const verifyBundleIsInDoc = async (bundleName: string) => {
      await waitFor(() => {
        const text = screen.getByText(bundleName)
        expect(text).toBeInTheDocument()
      })
    }

    await verifyBundleIsInDoc(bundle1);
    await verifyBundleIsInDoc(bundle3);
    await verifyBundleIsInDoc(bundle3);
  })
})