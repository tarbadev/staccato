import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BundleDetailPage } from './BundleDetailPage'

describe('BundleDetailPage', () => {
  it('should retrieve the bundle and display it', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    fetchMock.mockResponseOnce(request => {
      expect(request.url).toEqual(`/api/bundles/${bundleId}`)

      return Promise.resolve(JSON.stringify({ name: bundleName, id: bundleId }))
    })

    render(<BundleDetailPage match={{ params: { id: bundleId } }}/>)

    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()
    })
  })
})