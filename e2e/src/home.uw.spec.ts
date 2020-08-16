import HomePage from './page-object/HomePage'
import BundlePage from './page-object/BundlePage'

describe('Home', () => {
  let homePage: HomePage
  let bundlePage: BundlePage

  beforeEach(() => {
    homePage = new HomePage()
    bundlePage = new BundlePage()
  })

  it('should display the list of bundles', async () => {
    await homePage.goTo()

    const bundles = await homePage.getBundles()

    expect(bundles).toHaveLength(3)
    expect(bundles[0].name).toBe('Bundle 1')
    expect(bundles[1].name).toBe('Bundle 2')
    expect(bundles[2].name).toBe('Bundle 3')
  })

  it('should redirect to Bundle detail page', async () => {
    await homePage.goTo()

    await homePage.clickOnBundle('Bundle 2')

    await bundlePage.waitForPageLoaded()
    expect(bundlePage.getCurrentPageUrl()).toContain('/bundles/2')
  })
})