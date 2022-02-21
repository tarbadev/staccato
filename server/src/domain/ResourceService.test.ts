import ResourceService from './ResourceService'
import GoogleDrive from '../infrastructure/GoogleDrive'
import Resource from './Resource'
import ResourceRepository from '../infrastructure/ResourceRepository'

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
})