import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BundleDetailPage } from './BundleDetailPage'
import * as Utils from './Utils'
import { request } from './Utils'

describe('BundleDetailPage', () => {
  it('should retrieve the bundle and display it', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    jest.spyOn(Utils, 'request')
      .mockResolvedValue({ name: bundleName, id: bundleId })

    render(<BundleDetailPage match={{ params: { id: bundleId } }}/>)

    expect(request).toHaveBeenLastCalledWith({ url: `/api/bundles/${bundleId}` })

    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()
    })
  })
})