import HomePage from './page-object/HomePage'
import BundlePage from './page-object/BundlePage'
import connection from '@shared/DbHelperE2e'

describe('Home', () => {
  let homePage: HomePage
  let bundlePage: BundlePage

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    homePage = new HomePage()
    bundlePage = new BundlePage(0)
    return connection.clear()
  })

  it('should display the list of bundles', async () => {
    const bundlesToStore = [
      { name: 'Bundle 1', googleDriveId: '' },
      { name: 'Bundle 2', googleDriveId: '' },
      { name: 'Bundle 3', googleDriveId: '' },
    ]
    await connection.store('BundleEntity', bundlesToStore)

    await homePage.goTo()

    const bundles = await homePage.getBundles()

    expect(bundles).toHaveLength(3)
    expect(bundles[0].name).toBe('Bundle 1')
    expect(bundles[1].name).toBe('Bundle 2')
    expect(bundles[2].name).toBe('Bundle 3')
  })

  it('should display the newly created bundle', async () => {
    const bundleName = 'Some Super New Bundle'

    await homePage.goTo()

    await homePage.addBundle(bundleName)
    const bundles = await homePage.getBundles()

    expect(bundles).toHaveLength(1)
    expect(bundles[0].name).toBe(bundleName)
  })

  it('should redirect to Bundle detail page', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    await homePage.goTo()

    await homePage.clickOnBundle('Bundle 2')

    await bundlePage.waitForPageLoaded()
    expect(bundlePage.getCurrentPageUrl()).toContain(`/bundles/${storedBundle.id}`)
  })
})