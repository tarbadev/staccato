import BundlePageHelper from './page-object/BundlePageHelper'
import connection from '@shared/DbHelperE2e'
import { createFolder } from './GoogleDriveHelper'

describe('Bundle', () => {
  let bundlePageHelper: BundlePageHelper

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    return connection.clear()
  })

  it('should display the bundle details', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()

    expect(await bundlePageHelper.getTitle()).toEqual(storedBundle.name)
  })

  it('should rename the bundle', async () => {
    const folderId = await createFolder('Bundle 2')
    const bundleToStore = { name: 'Bundle 2', googleDriveId: folderId }
    const newName = 'My super new name'
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()

    expect(await bundlePageHelper.getTitle()).toEqual(storedBundle.name)

    await bundlePageHelper.editName(newName)
    expect(await bundlePageHelper.getTitle()).toEqual(newName)
  })
})