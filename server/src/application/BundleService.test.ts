import BundleService from './BundleService'
import BundleRepository from '../infrastructure/BundleRepository'
import GoogleDrive from '../infrastructure/GoogleDrive'

describe('BundleService', () => {
  const bundle = { id: 32, name: 'Some super bundle', googleDriveId: 'SuperDriveId' }
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

  it('should return the bundle on edit', async () => {
    const editedBundle = { ...bundle, name: 'New Bundle Name' }
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
})