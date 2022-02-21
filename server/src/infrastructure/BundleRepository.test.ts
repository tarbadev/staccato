import BundleRepository from './BundleRepository'
import connection from '@shared/DbHelperUnit'
import Bundle from '../domain/Bundle'
import { BundleEntity } from './entity/BundleEntity'
import { ResourceFactory } from '../testFactory'

describe('BundleRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

  it('should load the saved Bundles', async () => {
    const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
    bundle.resources = []

    expect(await BundleRepository.findAll()).toEqual([bundle])
  })

  describe('findOne', () => {
    it('should load the saved Bundle', async () => {
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await BundleRepository.findOne(bundle.id)).toEqual(bundle)
    })

    it('should throw if not found', async () => {
      await expect(BundleRepository.findOne(90)).rejects.toThrow(new Error('Bundle with id 90 was not found'))
    })
  })

  describe('save', () => {
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

      expect(await connection.getAllAuthors()).toHaveLength(0)

      const storedBundle = await BundleRepository.save(bundle)
      const resource = ResourceFactory()
      const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

      const storedBundleWithResource = await BundleRepository.save(updatedBundle)
      resource.id = storedBundleWithResource.resources[0].id

      expect(storedBundleWithResource.resources[0]).toEqual(resource)

      expect(await connection.getAllAuthors()).toHaveLength(2)
      expect(await connection.getAllComposers()).toHaveLength(2)
      expect(await connection.getAllArrangers()).toHaveLength(2)
      expect(await connection.getAllInstruments()).toHaveLength(3)
    })

    it('should retrieve the authors before storing the bundle', async () => {
      await connection.store('AuthorEntity', { name: 'First Author' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllAuthors()).toHaveLength(1)

      const storedBundle = await BundleRepository.save(bundle)
      const resource = ResourceFactory(
        {
          authors: ['First Author', 'Second Author'],
          album: undefined,
          audioType: undefined,
          composers: [],
          arrangers: [],
          instruments: [],
        },
      )
      const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

      const storedBundleWithResource = await BundleRepository.save(updatedBundle)
      resource.id = storedBundleWithResource.resources[0].id

      expect(storedBundleWithResource.resources[0]).toEqual(resource)

      expect(await connection.getAllAuthors()).toHaveLength(2)
    })

    it('should retrieve the composers before storing the bundle', async () => {
      await connection.store('ComposerEntity', { name: 'First Composer' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllComposers()).toHaveLength(1)

      const storedBundle = await BundleRepository.save(bundle)
      const resource = ResourceFactory(
        {
          authors: [],
          album: undefined,
          audioType: undefined,
          composers: ['First Composer', 'Second Composer'],
          arrangers: [],
          instruments: [],
        },
      )
      const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

      const storedBundleWithResource = await BundleRepository.save(updatedBundle)
      resource.id = storedBundleWithResource.resources[0].id

      expect(storedBundleWithResource.resources[0]).toEqual(resource)

      expect(await connection.getAllComposers()).toHaveLength(2)
    })

    it('should retrieve the arrangers before storing the bundle', async () => {
      await connection.store('ArrangerEntity', { name: 'First Arranger' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllArrangers()).toHaveLength(1)

      const storedBundle = await BundleRepository.save(bundle)
      const resource = ResourceFactory(
        {
          authors: [],
          album: undefined,
          audioType: undefined,
          composers: [],
          arrangers: ['First Arranger', 'Second Arranger'],
          instruments: [],
        },
      )
      const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

      const storedBundleWithResource = await BundleRepository.save(updatedBundle)
      resource.id = storedBundleWithResource.resources[0].id

      expect(storedBundleWithResource.resources[0]).toEqual(resource)

      expect(await connection.getAllArrangers()).toHaveLength(2)
    })

    it('should retrieve the instruments before storing the bundle', async () => {
      await connection.store('InstrumentEntity', { name: 'Violin' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllInstruments()).toHaveLength(1)

      const storedBundle = await BundleRepository.save(bundle)
      const resource = ResourceFactory(
        {
          authors: [],
          album: undefined,
          audioType: undefined,
          composers: [],
          arrangers: [],
          instruments: ['Piano', 'Violin', 'Trumpet'],
        },
      )
      const updatedBundle = new Bundle(storedBundle.id, storedBundle.name, storedBundle.googleDriveId, [resource])

      const storedBundleWithResource = await BundleRepository.save(updatedBundle)
      resource.id = storedBundleWithResource.resources[0].id

      expect(storedBundleWithResource.resources[0]).toEqual(resource)

      expect(await connection.getAllInstruments()).toHaveLength(3)
    })
  })
})