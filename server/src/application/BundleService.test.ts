import BundleService from './BundleService'
import BundleRepository from '../infrastructure/BundleRepository'

describe('BundleService', () => {
  const bundleService = new BundleService()

  it('should return the list of bundles', async () => {
    const bundles = [{ id: 32, name: 'Some super bundle' }]

    BundleRepository.findAll = jest.fn(() => Promise.resolve(bundles))

    expect(await bundleService.list()).toEqual(bundles)
  })

  it('should return the bundle on get', async () => {
    const bundle = { id: 32, name: 'Some super bundle' }

    BundleRepository.findOne = jest.fn((id) => Promise.resolve(bundle))

    expect(await bundleService.get(bundle.id)).toEqual(bundle)
  })

  it('should return the bundle on add', async () => {
    const name = 'Some super bundle'
    const bundle = { id: 32, name }

    BundleRepository.save = jest.fn(() => Promise.resolve(bundle))

    expect(await bundleService.add(name)).toEqual(bundle)
  })

  it('should return the bundle on edit', async () => {
    const bundle = { id: 32, name: 'Some super bundle' }
    const editedBundle = { id: 32, name: 'New Bundle Name' }

    BundleRepository.findOne = jest.fn(() => Promise.resolve(bundle))
    BundleRepository.save = jest.fn(() => Promise.resolve(editedBundle))

    const returnedBundle = await bundleService.edit(editedBundle.id, editedBundle.name)

    expect(BundleRepository.findOne).toHaveBeenCalledWith(bundle.id)
    expect(BundleRepository.save).toHaveBeenCalledWith(editedBundle)
    expect(returnedBundle).toEqual(editedBundle)
  })
})