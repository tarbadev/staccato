import BundleRepository from './BundleRepository'
import connection from '@shared/DbHelperUnit'
import Bundle from '../application/Bundle'
import { BundleEntity } from './BundleEntity'
import Resource from '../application/Resource'

describe('BundleRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

  it('should load the saved Bundles', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
    bundle.resources = []

    expect(await BundleRepository.findAll()).toEqual([bundle])
  })

  it('should load the saved Bundle', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
    bundle.resources = []

    expect(await BundleRepository.findOne(bundle.id)).toEqual(bundle)
  })

  it('should throw if not found', async () => {
    await expect(BundleRepository.findOne(90)).rejects.toThrow(new Error('Bundle with id 90 was not found'))
  })

  it('should save the new Bundle', async () => {
    const bundleToSave = new Bundle(0, 'Some New Bundle', 'SomeId')

    const storedBundle = await BundleRepository.save(bundleToSave)

    const actualStored = await connection.get('BundleEntity', storedBundle.id) as BundleEntity
    actualStored.resources = []

    expect(storedBundle.name).toEqual(bundleToSave.name)
    expect(actualStored).toEqual(storedBundle)
  })

  it('should save the resources with the bundle', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
    bundle.resources = []

    const storedBundle = await BundleRepository.save(bundle)
    const resource = new Resource(0, 'SomeResource', 'someResourceDriveId', '/path/to/resource')
    const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

    const storedBundleWithResource = await BundleRepository.save(updatedBundle)

    expect(storedBundleWithResource.resources[0]).toEqual(resource)
  })
})