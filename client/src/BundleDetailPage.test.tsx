import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BundleDetailPage } from './BundleDetailPage'
import * as Utils from './Utils'
import { request } from './Utils'

const requestSpy = jest.spyOn(Utils, 'request')

describe('BundleDetailPage', () => {
  it('should retrieve the bundle and display it', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    requestSpy.mockResolvedValue({ name: bundleName, id: bundleId })

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }}/>)

    expect(request).toHaveBeenLastCalledWith({ url: `/api/bundles/${bundleId}` })

    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()
    })
  })

  it('should send a request to rename the bundle', async () => {
    const bundleName = 'Some Bundle Name'
    const newName = 'New Name'
    const bundleId = 2

    requestSpy.mockResolvedValue({ name: bundleName, id: bundleId })

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }}/>)

    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    await waitFor(() => {
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeInTheDocument()
      expect(input.value).toEqual(bundleName)

      fireEvent.change(input, { target: { value: newName } })
    })

    requestSpy.mockResolvedValue({ name: newName, id: bundleId })

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(request).toHaveBeenLastCalledWith({
      url: `/api/bundles/${bundleId}`,
      method: 'POST',
      body: { name: newName },
    })

    await waitFor(() => {
      const text = screen.getByText(newName)
      expect(text).toBeInTheDocument()
    })
  })
})