import BundleService from './BundleService'
import BundleRepository from '../infrastructure/BundleRepository'

describe('BundleService', () => {
  const bundleService = new BundleService()

  it('should return the list of bundles', async () => {
    const bundles = [{ id: 32, name: 'Some super bundle' }]

    BundleRepository.findAll = jest.fn(() => Promise.resolve(bundles))

    expect(await bundleService.list()).toEqual(bundles)
  })

  it('should return the bundle', async () => {
    const bundle = { id: 32, name: 'Some super bundle' }

    BundleRepository.findOne = jest.fn((id) => Promise.resolve(bundle))

    expect(await bundleService.get(bundle.id)).toEqual(bundle)
  })
})