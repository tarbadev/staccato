import HomePageHelper from './page-object/HomePageHelper'
import BundlePageHelper from './page-object/BundlePageHelper'
import connection from '@shared/DbHelperE2e'
import SettingsPageHelper from './page-object/SettingsPageHelper'

describe('Home', () => {
  let homePageHelper: HomePageHelper
  let settingsPageHelper: SettingsPageHelper
  let bundlePageHelper: BundlePageHelper

  beforeAll(() => connection.create())
  afterAll(() => connection.close())

  beforeEach(() => {
    homePageHelper = new HomePageHelper()
    settingsPageHelper = new SettingsPageHelper()
    bundlePageHelper = new BundlePageHelper(0)
    return connection.clear()
  })

  it('should display the list of bundles', async () => {
    const bundlesToStore = [
      { name: 'Bundle 1', googleDriveId: '' },
      { name: 'Bundle 2', googleDriveId: '' },
      { name: 'Bundle 3', googleDriveId: '' },
    ]
    await connection.store('BundleEntity', bundlesToStore)

    await homePageHelper.goTo()

    const bundles = await homePageHelper.getBundles()

    expect(bundles).toHaveLength(3)
    expect(bundles[0].name).toBe('Bundle 1')
    expect(bundles[1].name).toBe('Bundle 2')
    expect(bundles[2].name).toBe('Bundle 3')
  })

  it('should display the newly created bundle', async () => {
    const bundleName = 'Some Super New Bundle'

    await homePageHelper.goTo()

    await homePageHelper.addBundle(bundleName)
    const bundles = await homePageHelper.getBundles()

    expect(bundles).toHaveLength(1)
    expect(bundles[0].name).toBe(bundleName)
  })

  it('should redirect to Bundle detail page', async () => {
    const bundleToStore = { name: 'Bundle 2', googleDriveId: '' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    await homePageHelper.goTo()

    await homePageHelper.clickOnBundle('Bundle 2')

    await bundlePageHelper.waitForPageLoaded()
    expect(bundlePageHelper.getCurrentPageUrl()).toContain(`/bundles/${storedBundle.id}`)
  })

  it('should redirect to Settings page', async () => {
    await homePageHelper.goTo()

    await homePageHelper.clickOnSettingsButton()

    await settingsPageHelper.waitForPageLoaded()
    expect(settingsPageHelper.getCurrentPageUrl()).toContain('/settings')
  })
})