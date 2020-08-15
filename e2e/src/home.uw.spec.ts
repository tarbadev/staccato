import HomePage from './page-object/HomePage'

describe('Home', () => {
  let homePage

  beforeEach(() => {
    homePage = new HomePage()
  })

  it('should display the list of bundles', async () => {
    await homePage.goTo()

    const bundles = await homePage.getBundles()

    expect(bundles).toHaveLength(3)
    expect(bundles[0].name).toBe('Bundle 1')
    expect(bundles[1].name).toBe('Bundle 2')
    expect(bundles[2].name).toBe('Bundle 3')
  })
})