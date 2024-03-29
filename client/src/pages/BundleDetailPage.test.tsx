import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BundleDetailPage } from './BundleDetailPage'
import * as Utils from '../Utils'
import { request } from '../Utils'
import Bundle from '@shared/Bundle'
import Resource, { AudioType, ResourceType } from '@shared/Resource'
import { useParams } from 'react-router-dom'
import { mocked } from 'jest-mock'

const requestSpy = jest.spyOn(Utils, 'request')
jest.mock('react-router-dom')

const mockUseParams = mocked(useParams)

describe('BundleDetailPage', () => {
  const bundleId = 2

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: bundleId.toString() })
  })

  it('should retrieve the bundle and display it', async () => {
    const bundleName = 'Some Bundle Name'
    const resource: Resource = { id: 31, title: 'Such a pretty picture', url: 'path/to/img', type: 'image' }
    const bundle: Bundle = { name: bundleName, id: bundleId, driveUrl: '', resources: [resource] }

    requestSpy.mockResolvedValue(bundle)

    render(<BundleDetailPage />)

    expect(request).toHaveBeenLastCalledWith({ url: `/api/bundles/${bundleId}` })

    await waitFor(() => {
      const text = screen.getByText(bundleName)
      expect(text).toBeInTheDocument()

      const resourceTitle = screen.getByText(resource.title!)
      expect(resourceTitle).toBeInTheDocument()

      const image = screen.getByTitle(resource.title!)
      expect(image).toBeInTheDocument()
    })
  })

  it('should send a request to rename the bundle', async () => {
    const bundleName = 'Some Bundle Name'
    const newName = 'New Name'

    requestSpy.mockResolvedValue({ name: bundleName, id: bundleId, resources: [] })

    render(<BundleDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    await waitFor(() => {
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input).toBeInTheDocument()
      expect(input.value).toEqual(bundleName)

      fireEvent.change(input, { target: { value: newName } })
    })

    requestSpy.mockResolvedValue({ name: newName, id: bundleId, resources: [] })

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
    requestSpy.mockResolvedValue({ name: 'Some Name', id: bundleId, resources: [] })

    render(<BundleDetailPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Add Resource' }))

    await waitFor(() => {
      const imageMenu = screen.getByRole('menuitem', { name: 'Image' })
      expect(imageMenu).toBeInTheDocument()

      const videoMenu = screen.getByRole('menuitem', { name: 'Video' })
      expect(videoMenu).toBeInTheDocument()

      const audioMenu = screen.getByRole('menuitem', { name: 'Audio' })
      expect(audioMenu).toBeInTheDocument()

      const songMenu = screen.getByRole('menuitem', { name: 'Song Partition' })
      expect(songMenu).toBeInTheDocument()

      const orchestralMenu = screen.getByRole('menuitem', { name: 'Orchestral Partition' })
      expect(orchestralMenu).toBeInTheDocument()
    })
  })

  describe('upload resource', () => {
    const testUpload = async (
      title: string,
      resourceType: string,
      fileName: string,
      mimeType: string,
      otherFields?: { source?: string, album?: string, authors?: string[], composers?: string[], arrangers?: string[], instruments?: string[], audioType?: AudioType },
    ) => {
      const bundle = { name: 'Some Name', id: bundleId, resources: [] }

      requestSpy.mockResolvedValue(bundle)

      render(<BundleDetailPage />)

      fireEvent.click(screen.getByRole('button', { name: 'Add Resource' }))

      await waitFor(() => {
        const text = screen.getByRole('menuitem', { name: resourceType })
        expect(text).toBeInTheDocument()
        fireEvent.click(text)
      })

      const input = screen.getByLabelText('dropzone')
      const someFileContent = 'Some File Content'
      const file = new File([someFileContent], fileName, { type: mimeType })
      userEvent.upload(input, file)

      await waitFor(() => {
        const input = screen.getByRole('textbox', { name: /title/i }) as HTMLInputElement
        expect(input).toBeInTheDocument()

        fireEvent.change(input, { target: { value: title } })
      })

      if (otherFields) {
        if (otherFields.source) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /source/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields.source } })
          })
        }

        if (otherFields.authors) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /authors/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields!.authors!.join(';') } })
          })
        }

        if (otherFields.composers) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /composers/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields!.composers!.join(';') } })
          })
        }

        if (otherFields.arrangers) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /arrangers/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields!.arrangers!.join(';') } })
          })
        }

        if (otherFields.instruments) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /instruments/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields!.instruments!.join(';') } })
          })
        }

        if (otherFields.album) {
          await waitFor(() => {
            const input = screen.getByRole('textbox', { name: /album/i }) as HTMLInputElement
            expect(input).toBeInTheDocument()

            fireEvent.change(input, { target: { value: otherFields.album } })
          })
        }

        if (otherFields.audioType) {
          const switchElement = screen.getByRole('checkbox') as HTMLInputElement
          expect(switchElement).toBeInTheDocument()

          fireEvent.change(
            switchElement,
            { target: { value: otherFields.audioType === 'playback' ? 'song' : 'playback' } },
          )
        }
      }

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
            body: {
              name: fileName,
              title,
              type: mimeType,
              data: `data:${mimeType};base64,${Buffer.from(someFileContent).toString('base64')}`,
              ...otherFields,
            },
          },
        )
      })

      expect(screen.queryByRole('textbox', { name: /title/i })).not.toBeInTheDocument()
    }

    it('should send an upload request with the image', async () => {
      await testUpload('My image title', 'Image', 'example.png', 'image/png')
    })

    it('should send an upload request with the video', async () => {
      await testUpload('My video title', 'Video', 'example.mp4', 'video/mp4', {
        authors: [
          'First Author',
          'Second Author',
        ], source: 'http://example.com',
      })
    })

    it('should send an upload request with the music', async () => {
      await testUpload('My music title', 'Audio', 'example.mp3', 'audio/mp3', {
        authors: [
          'First Author',
          'Second Author',
        ], album: 'Some top hit album', audioType: 'song',
      })
    })

    it('should send an upload request with the song partition', async () => {
      await testUpload(
        'My song partition title',
        'Song Partition',
        'example.pdf',
        'application/pdf',
        {
          authors: [
            'First Author',
            'Second Author',
          ],
        },
      )
    })

    it('should send an upload request with the orchestral partition', async () => {
      await testUpload(
        'My orchestral partition title',
        'Orchestral Partition',
        'example.pdf',
        'application/pdf',
        {
          composers: ['First Composer', 'Second Composer'],
          arrangers: ['First Arranger', 'Second Arranger'],
          instruments: ['Piano', 'Violin', 'Trumpet'],
        },
      )
    })
  })

  describe('delete resource', () => {
    const testDeleteResource = async (resourceType: ResourceType) => {
      const resourceId = 43765
      const resource: Resource = { title: 'Some amazing resource', url: '', id: resourceId, type: resourceType }
      const bundle: Bundle = { name: 'Some Name', id: bundleId, driveUrl: '', resources: [resource] }

      requestSpy.mockResolvedValue(bundle)

      render(<BundleDetailPage />)

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'delete' })
        expect(button).not.toBeDisabled()
        expect(fireEvent.click(button)).toBeTruthy()
      })

      await waitFor(() => {
        expect(request).toHaveBeenCalledWith(
          {
            url: `/api/bundles/${bundleId}/resources/${resourceId}`,
            method: 'DELETE',
          },
        )
      })
    }

    it('should delete an image', async () => {
      await testDeleteResource('image')
    })

    it('should delete a video', async () => {
      await testDeleteResource('video')
    })

    it('should delete a music', async () => {
      await testDeleteResource('audio')
    })

    it('should delete a song partition', async () => {
      await testDeleteResource('song-partition')
    })

    it('should delete a orchestral partition', async () => {
      await testDeleteResource('orchestral-partition')
    })
  })
})