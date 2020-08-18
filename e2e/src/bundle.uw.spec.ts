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
    const bundleToStore = { name: 'Bundle 2' }
    const storedBundle = await connection.store('BundleEntity', bundleToStore)

    bundlePage = new BundlePage(storedBundle.id)
    await bundlePage.goTo()

    expect(await bundlePage.getTitle()).toEqual(storedBundle.name)
  })
})