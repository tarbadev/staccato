import BundleRepository from './BundleRepository'
import connection from '@shared/DbHelperUnit'

describe('BundleRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

  it('should load the saved Bundles', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })

    expect(await BundleRepository.findAll()).toEqual([bundle])
  })

  it('should load the saved Bundle', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })

    expect(await BundleRepository.findOne(bundle.id)).toEqual(bundle)
  })

  it('should throw if not found', async () => {
    await expect(BundleRepository.findOne(90)).rejects.toThrow(new Error('Bundle with id 90 was not found'))
  })

  it('should save the new Bundle', async () => {
    const bundleToSave = { id: 0, name: 'Some New Bundle', googleDriveId: 'SomeId' }

    const storedBundle = await BundleRepository.save(bundleToSave)
    expect(storedBundle.name).toEqual(bundleToSave.name)
    expect(await connection.get('BundleEntity', storedBundle.id)).toEqual(storedBundle)
  })
})