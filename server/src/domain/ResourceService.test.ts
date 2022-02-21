import ResourceService from './ResourceService'
import GoogleDrive from '../infrastructure/GoogleDrive'
import Resource from './Resource'
import ResourceRepository from '../infrastructure/ResourceRepository'
import Bundle from './Bundle'

describe('ResourceService', () => {
  const resourceService = new ResourceService()

  it('should delete the resource and google file on deleteResource', async () => {
    const driveId = 'GoogleDriveFileId'
    const resourceId = 987
    const mockDeleteFile = jest.fn()

    // @ts-ignore
    jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({ deleteFile: mockDeleteFile })
    const resource = new Resource(resourceId, undefined, 'image', driveId, '')

    ResourceRepository.delete = jest.fn()
    ResourceRepository.findOne = jest.fn(() => Promise.resolve(resource))

    await resourceService.delete(resourceId)

    expect(ResourceRepository.delete).toHaveBeenCalledWith(resourceId)
    expect(mockDeleteFile).toHaveBeenCalledWith(driveId)
  })

  describe('upload', () => {
    const bundle = new Bundle(32, 'Some super bundle', 'SuperDriveId')

    it('should create a Google Drive file and save it', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const resource: Resource = {
        id: 0,
        title: 'Some Title',
        type: 'image',
        googleDriveId: resourceId,
        googleDriveLink: resourceLink,
        source: 'https://example.com',
        authors: ['First Author', 'Second Author'],
        album: 'Some Hit Album',
        audioType: 'song',
      }
      const resourceWithId: Resource = {
        ...resource,
        id: 34,
      }

      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({ uploadFile: mockUploadFile })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      ResourceRepository.save = jest.fn(() => Promise.resolve(resourceWithId))

      const returnedResource = await resourceService.upload(
        bundle,
        {
          name: 'example.png',
          type: 'image/png',
          filePath,
          title: 'Some Title',
          source: 'https://example.com',
          authors: ['First Author', 'Second Author'],
          album: 'Some Hit Album',
          audioType: 'song',
        },
      )

      expect(mockUploadFile).toHaveBeenCalledWith(bundle.googleDriveId, 'example.png', 'image/png', filePath)
      expect(ResourceRepository.save).toHaveBeenCalledWith(bundle, resource)
      expect(returnedResource).toEqual(resourceWithId)
    })

    it('should determine the type song partition', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const resource = new Resource(
        0,
        'Some Title',
        'song-partition',
        resourceId,
        resourceLink,
        undefined,
        ['First Author', 'Second Author'],
      )
      const resourceWithId: Resource = {
        ...resource,
        id: 34,
      }

      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        uploadFile: mockUploadFile,
      })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      ResourceRepository.save = jest.fn(() => Promise.resolve(resourceWithId))

      const returnedBundle = await resourceService.upload(
        bundle,
        {
          name: 'example.pdf',
          type: 'application/pdf',
          filePath,
          title: 'Some Title',
          authors: ['First Author', 'Second Author'],
        },
      )

      expect(mockUploadFile).toHaveBeenCalledWith(bundle.googleDriveId, 'example.pdf', 'application/pdf', filePath)
      expect(ResourceRepository.save).toHaveBeenCalledWith(bundle, resource)
      expect(returnedBundle).toEqual(resourceWithId)
    })

    it('should determine the type orchestral partition', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const resource = new Resource(
        0,
        'Some Title',
        'orchestral-partition',
        resourceId,
        resourceLink,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        ['Piano', 'Trumpet'],
      )
      const resourceWithId: Resource = {
        ...resource,
        id: 34,
      }

      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        uploadFile: mockUploadFile,
      })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      ResourceRepository.save = jest.fn(() => Promise.resolve(resourceWithId))

      const returnedBundle = await resourceService.upload(
        bundle,
        {
          name: 'example.pdf',
          type: 'application/pdf',
          filePath,
          title: 'Some Title',
          instruments: ['Piano', 'Trumpet'],
        },
      )

      expect(mockUploadFile).toHaveBeenCalledWith(bundle.googleDriveId, 'example.pdf', 'application/pdf', filePath)
      expect(ResourceRepository.save).toHaveBeenCalledWith(bundle, resource)
      expect(returnedBundle).toEqual(resourceWithId)
    })
  })
})