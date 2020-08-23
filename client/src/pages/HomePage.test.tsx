import React from 'react'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { HomePage } from './HomePage'
import * as Utils from '../Utils'
import { request } from '../Utils'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}))

const requestSpy = jest.spyOn(Utils, 'request')

describe('HomePage', () => {
  const verifyBundleIsInDoc = async (bundleName: string) => {
    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()
    })
  }

  async function addBundle(bundleName: string) {
    fireEvent.click(screen.getByRole('button', { name: 'add' }))

    await waitFor(() => {
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeInTheDocument()

      fireEvent.change(input, { target: { value: bundleName } })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitForElementToBeRemoved(() => screen.getByRole('textbox'))
  }

  beforeEach(() => {
    requestSpy.mockReset()
    requestSpy.mockClear()
  })

  it('Displays the list of bundles', async () => {
    const bundle1 = 'Bundle 1'
    const bundle2 = 'Bundle 2'
    const bundle3 = 'Bundle 3'
    const response = [
      { name: bundle1 },
      { name: bundle2 },
      { name: bundle3 },
    ]

    requestSpy.mockResolvedValue(response)

    render(<HomePage />)

    expect(request).toHaveBeenCalledWith({ url: '/api/bundles' })

    await verifyBundleIsInDoc(bundle1)
    await verifyBundleIsInDoc(bundle3)
    await verifyBundleIsInDoc(bundle3)
  })

  it('should redirect to bundle details page on bundle click', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    requestSpy.mockResolvedValue([{ name: bundleName, id: bundleId }])

    render(<HomePage />)

    await verifyBundleIsInDoc(bundleName)
    fireEvent.click(screen.getByText(bundleName))

    expect(mockPush).toHaveBeenCalledWith(`/bundles/${bundleId}`)
  })

  it('should post the new bundle', async () => {
    const bundleName = 'Some Bundle Name'

    requestSpy.mockResolvedValue([])

    render(<HomePage />)

    await addBundle(bundleName)

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith({ url: '/api/bundles', method: 'POST', body: { name: bundleName } })
    })
  })

  it('should load the bundles once the new bundle is added', async () => {
    const bundleName = 'Some Bundle Name'

    requestSpy.mockResolvedValue([])

    render(<HomePage />)

    await addBundle(bundleName)

    await waitFor(() => {
      expect(request).toHaveBeenCalledTimes(3)
      expect(request).toHaveBeenLastCalledWith({ url: '/api/bundles' })
    })
  })
})