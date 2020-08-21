import BundlePageHelper from './page-object/BundlePageHelper'
import connection from '@shared/DbHelperE2e'

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
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '1tfzFm6NJ-f7icA4zlNEmamd5cNPuIbTI' }
    const newName = 'My super new name'
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePageHelper = new BundlePageHelper(storedBundle.id)
    await bundlePageHelper.goTo()

    expect(await bundlePageHelper.getTitle()).toEqual(storedBundle.name)

    await bundlePageHelper.editName(newName)
    expect(await bundlePageHelper.getTitle()).toEqual(newName)
  })
})