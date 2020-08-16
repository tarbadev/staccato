import React from 'react'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import { HomePage } from './HomePage'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush
  })
}))

describe('HomePage', () => {
  const verifyBundleIsInDoc = async (bundleName: string) => {
    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()
    })
  }

  it('Displays the list of bundles', async () => {
    const bundle1 = 'Bundle 1'
    const bundle2 = 'Bundle 2'
    const bundle3 = 'Bundle 3'
    const response = [
      { name: bundle1 },
      { name: bundle2 },
      { name: bundle3 },
    ]

    fetchMock.mockResponseOnce(request => {
      expect(request.url).toBe('/api/bundles')

      return Promise.resolve(JSON.stringify(response))
    })

    render(<HomePage/>)

    await verifyBundleIsInDoc(bundle1)
    await verifyBundleIsInDoc(bundle3)
    await verifyBundleIsInDoc(bundle3)
  })

  it('should redirect to bundle details page on bundle click', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    fetchMock.mockResponseOnce(request => {
      expect(request.url).toBe('/api/bundles')

      return Promise.resolve(JSON.stringify([{ name: bundleName, id: bundleId }]))
    })

    render(<HomePage/>)

    await verifyBundleIsInDoc(bundleName)
    fireEvent.click(screen.getByText(bundleName))

    expect(mockPush).toHaveBeenCalledWith(`/bundles/${bundleId}`)
  })
})