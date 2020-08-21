import BundlePage from './page-object/BundlePage'
import connection from '@shared/DbHelperE2e'

describe('Bundle', () => {
  let bundlePage: BundlePage

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    return connection.clear()
  })

  it('should display the bundle details', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePage = new BundlePage(storedBundle.id)
    await bundlePage.goTo()

    expect(await bundlePage.getTitle()).toEqual(storedBundle.name)
  })

  it('should rename the bundle', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '1tfzFm6NJ-f7icA4zlNEmamd5cNPuIbTI' }
    const newName = 'My super new name'
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePage = new BundlePage(storedBundle.id)
    await bundlePage.goTo()

    expect(await bundlePage.getTitle()).toEqual(storedBundle.name)

    await bundlePage.editName(newName)
    expect(await bundlePage.getTitle()).toEqual(newName)
  })
})