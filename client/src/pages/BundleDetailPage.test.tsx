import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import { BundleDetailPage } from './BundleDetailPage'
import * as Utils from '../Utils'
import { request } from '../Utils'

const requestSpy = jest.spyOn(Utils, 'request')

describe('BundleDetailPage', () => {
  it('should retrieve the bundle and display it', async () => {
    const bundleName = 'Some Bundle Name'
    const bundleId = 2

    requestSpy.mockResolvedValue({ name: bundleName, id: bundleId })

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }} />)

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

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }} />)

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

  it('should display a menu to add resources', async () => {
    const bundleId = 2

    requestSpy.mockResolvedValue({ name: 'Some Name', id: bundleId })

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add Resource' }))

    await waitFor(() => {
      const text = screen.getByRole('menuitem', { name: 'Image' })
      expect(text).toBeInTheDocument()
    })
  })

  it('should send an upload request with the file', async () => {
    const bundleId = 2
    const title = 'My image title'
    const bundle = { name: 'Some Name', id: bundleId }

    requestSpy.mockResolvedValue(bundle)

    render(<BundleDetailPage match={{ params: { id: bundleId.toString() } }} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add Resource' }))

    await waitFor(() => {
      const text = screen.getByRole('menuitem', { name: 'Image' })
      expect(text).toBeInTheDocument()
      fireEvent.click(text)
    })

    const input = screen.getByText('Drag and drop a file here or click')
    const someImageContent = 'Some Image Content'
    const file = new File([someImageContent], 'example.png', { type: 'image/png' })
    user.upload(input, file)
    fireEvent.drop(input)

    await waitFor(() => {
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeInTheDocument()

      fireEvent.change(input, { target: { value: title } })
    })

    await waitFor(() => {
      const button = screen.getByRole('button', { name: 'Submit' })
      expect(button).not.toBeDisabled()
      expect(fireEvent.click(button)).toBeTruthy()
    })

    await waitFor(() => {
      expect(request).toHaveBeenCalledWith(
        {
          url: `/api/bundles/${bundleId}/resources`,
          method: 'POST',
          body: { name: 'example.png', title, type: 'image/png', data: `data:image/png;base64,${btoa(someImageContent)}` },
        },
      )
    })
  })
})