import BundleService from './BundleService'
import BundleRepository from '../infrastructure/BundleRepository'
import GoogleDrive from '../infrastructure/GoogleDrive'
import Bundle from './Bundle'
import Resource from './Resource'
import ResourceRepository from '../infrastructure/ResourceRepository'

describe('BundleService', () => {
  const bundle = new Bundle(32, 'Some super bundle', 'SuperDriveId')
  const bundleService = new BundleService()

  it('should return the list of bundles', async () => {
    const bundles = [bundle]

    BundleRepository.findAll = jest.fn(() => Promise.resolve(bundles))

    expect(await bundleService.list()).toEqual(bundles)
  })

  it('should return the bundle on get', async () => {
    BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))

    expect(await bundleService.get(bundle.id)).toEqual(bundle)
  })

  it('should create a Google Drive folder and save it', async () => {
    const mockCreateFolder = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
      createFolder: mockCreateFolder,
    })
    mockCreateFolder.mockImplementationOnce(() => Promise.resolve(bundle.googleDriveId))
    BundleRepository.save = jest.fn(() => Promise.resolve(bundle))

    const returnedBundle = await bundleService.add(bundle.name)

    expect(mockCreateFolder).toHaveBeenCalledWith(bundle.name)
    expect(returnedBundle).toEqual(bundle)
  })

  describe('upload', () => {
    it('should create a Google Drive file and save it', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const bundleWithResource = new Bundle(
        bundle.id,
        bundle.name,
        bundle.googleDriveId,
        [
          {
            id: 0,
            title: 'Some Title',
            type: 'image',
            googleDriveId: resourceId,
            googleDriveLink: resourceLink,
            source: 'https://example.com',
            authors: ['First Author', 'Second Author'],
            album: 'Some Hit Album',
            audioType: 'song',
          },
        ],
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        uploadFile: mockUploadFile,
      })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))
      BundleRepository.save = jest.fn(() => Promise.resolve(bundleWithResource))

      const returnedBundle = await bundleService.upload(
        bundle.id,
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
      expect(BundleRepository.save).toHaveBeenCalledWith(bundleWithResource)
      expect(returnedBundle).toEqual(bundleWithResource)
    })

    it('should determine the type song partition', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const bundleWithResource = new Bundle(
        bundle.id,
        bundle.name,
        bundle.googleDriveId,
        [
          new Resource(
            0,
            'Some Title',
            'song-partition',
            resourceId,
            resourceLink,
            undefined,
            ['First Author', 'Second Author'],
          ),
        ],
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        uploadFile: mockUploadFile,
      })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))
      BundleRepository.save = jest.fn(() => Promise.resolve(bundleWithResource))

      const returnedBundle = await bundleService.upload(
        bundle.id,
        {
          name: 'example.pdf',
          type: 'application/pdf',
          filePath,
          title: 'Some Title',
          authors: ['First Author', 'Second Author'],
        },
      )

      expect(mockUploadFile).toHaveBeenCalledWith(bundle.googleDriveId, 'example.pdf', 'application/pdf', filePath)
      expect(BundleRepository.save).toHaveBeenCalledWith(bundleWithResource)
      expect(returnedBundle).toEqual(bundleWithResource)
    })

    it('should determine the type orchestral partition', async () => {
      const filePath = '/path/to/temp/file'
      const mockUploadFile = jest.fn()
      const resourceId = 'SomeSuperId'
      const resourceLink = '/path/to/resource'
      const bundleWithResource = new Bundle(
        bundle.id,
        bundle.name,
        bundle.googleDriveId,
        [
          new Resource(
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
          ),
        ],
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
        uploadFile: mockUploadFile,
      })
      mockUploadFile.mockImplementationOnce(() => Promise.resolve({ id: resourceId, link: resourceLink }))
      BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))
      BundleRepository.save = jest.fn(() => Promise.resolve(bundleWithResource))

      const returnedBundle = await bundleService.upload(
        bundle.id,
        {
          name: 'example.pdf',
          type: 'application/pdf',
          filePath,
          title: 'Some Title',
          instruments: ['Piano', 'Trumpet'],
        },
      )

      expect(mockUploadFile).toHaveBeenCalledWith(bundle.googleDriveId, 'example.pdf', 'application/pdf', filePath)
      expect(BundleRepository.save).toHaveBeenCalledWith(bundleWithResource)
      expect(returnedBundle).toEqual(bundleWithResource)
    })
  })

  it('should return the bundle on edit', async () => {
    const editedBundle = new Bundle(
      bundle.id,
      'New Bundle Name',
      bundle.googleDriveId,
      bundle.resources,
    )
    const mockRenameFile = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({
      renameFile: mockRenameFile,
    })

    mockRenameFile.mockResolvedValueOnce(undefined)
    BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))
    BundleRepository.save = jest.fn(() => Promise.resolve(editedBundle))

    const returnedBundle = await bundleService.edit(editedBundle.id, editedBundle.name)

    expect(mockRenameFile).toHaveBeenCalledWith(bundle.googleDriveId, editedBundle.name)
    expect(BundleRepository.findOne).toHaveBeenCalledWith(bundle.id)
    expect(BundleRepository.save).toHaveBeenCalledWith(editedBundle)
    expect(returnedBundle).toEqual(editedBundle)
  })


  it('should delete the resource and google file on deleteResource', async () => {
    const driveId = 'GoogleDriveFileId'
    const bundleId = 432
    const resourceId = 987
    const mockDeleteFile = jest.fn()

    // @ts-ignore
    jest.spyOn(GoogleDrive, 'getInstance').mockReturnValueOnce({ deleteFile: mockDeleteFile })
    const resource = new Resource(resourceId, undefined, 'image', driveId, '')

    ResourceRepository.delete = jest.fn()
    ResourceRepository.findOne = jest.fn(() => Promise.resolve(resource))

    await bundleService.deleteResource(bundleId, resourceId)

    expect(ResourceRepository.delete).toHaveBeenCalledWith(resourceId)
    expect(mockDeleteFile).toHaveBeenCalledWith(driveId)
  })
})