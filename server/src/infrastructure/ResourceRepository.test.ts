import ResourceRepository from './ResourceRepository'
import connection from '@shared/DbHelperUnit'
import { ResourceEntity } from './entity/ResourceEntity'
import { mapFromResourceEntity } from './EntityMapper'
import { ResourceEntityFactory, ResourceFactory } from '../testFactory'
import { BundleEntity } from './entity/BundleEntity'

describe('ResourceRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

  describe('delete', () => {
    it('should delete the existing resource', async () => {
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      const resourceEntity: ResourceEntity = {
        id: 0,
        title: 'Some New Resource',
        googleDriveId: 'SuperId',
        type: 'image',
        googleDriveLink: '',
        bundle,
      }
      const resource = await connection.store(
        'ResourceEntity',
        resourceEntity,
      )

      expect(await connection.getAllResources()).toHaveLength(1)

      await ResourceRepository.delete(resource.id)

      expect(await connection.getAllResources()).toHaveLength(0)
    })

    it('should delete the existing resource and relationships', async () => {
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      const author = await connection.store('AuthorEntity', { name: 'Some Author' })
      const arranger = await connection.store('ArrangerEntity', { name: 'Some Arranger' })
      const composer = await connection.store('ComposerEntity', { name: 'Some Composer' })
      const instrument = await connection.store('InstrumentEntity', { name: 'Some Instrument' })
      const resourceEntity: ResourceEntity = {
        id: 0,
        title: 'Some New Resource',
        googleDriveId: 'SuperId',
        type: 'image',
        googleDriveLink: '',
        bundle,
        authors: [author],
        arrangers: [arranger],
        composers: [composer],
        instruments: [instrument],
      }
      const resource = await connection.store(
        'ResourceEntity',
        resourceEntity,
      )

      expect(await connection.getAllResources()).toHaveLength(1)

      await ResourceRepository.delete(resource.id)

      expect(await connection.getAllResources()).toHaveLength(0)
    })

    it('should throw an error if the resource is not found', async () => {
      expect(await connection.getAllResources()).toHaveLength(0)

      await expect(ResourceRepository.delete(123)).rejects.toThrow('Resource was not found')
    })
  })

  describe('findOne', () => {
    it('should load the stored Resource', async () => {
      const bundleEntity = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      const resourceEntity = ResourceEntityFactory({ bundle: bundleEntity })
      const resourceEntityStored = await connection.store('ResourceEntity', resourceEntity)

      const expectedResource = mapFromResourceEntity(resourceEntityStored)

      expect(await ResourceRepository.findOne(resourceEntityStored.id)).toEqual(expectedResource)
    })

    it('should throw if not found', async () => {
      await expect(ResourceRepository.findOne(90)).rejects.toThrow(new Error('Resource with id 90 was not found'))
    })
  })

  describe('save', () => {
    it('should save the resource', async () => {
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllAuthors()).toHaveLength(0)

      const resource = ResourceFactory()

      const storedResource = await ResourceRepository.save(bundle, resource)
      resource.id = storedResource.id

      expect(storedResource).toEqual(resource)

      expect(await connection.getAllAuthors()).toHaveLength(2)
      expect(await connection.getAllComposers()).toHaveLength(2)
      expect(await connection.getAllArrangers()).toHaveLength(2)
      expect(await connection.getAllInstruments()).toHaveLength(3)
    })

    it('should retrieve the authors before storing the resource', async () => {
      await connection.store('AuthorEntity', { name: 'First Author' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllAuthors()).toHaveLength(1)

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

      const storedResource = await ResourceRepository.save(bundle, resource)
      resource.id = storedResource.id

      expect(storedResource).toEqual(resource)

      expect(await connection.getAllAuthors()).toHaveLength(2)
    })

    it('should retrieve the composers before storing the resource', async () => {
      await connection.store('ComposerEntity', { name: 'First Composer' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllComposers()).toHaveLength(1)

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

      const storedResource = await ResourceRepository.save(bundle, resource)
      resource.id = storedResource.id

      expect(storedResource).toEqual(resource)

      expect(await connection.getAllComposers()).toHaveLength(2)
    })

    it('should retrieve the arrangers before storing the resource', async () => {
      await connection.store('ArrangerEntity', { name: 'First Arranger' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllArrangers()).toHaveLength(1)

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

      const storedResource = await ResourceRepository.save(bundle, resource)
      resource.id = storedResource.id

      expect(storedResource).toEqual(resource)

      expect(await connection.getAllArrangers()).toHaveLength(2)
    })

    it('should retrieve the instruments before storing the resource', async () => {
      await connection.store('InstrumentEntity', { name: 'Violin' })
      const bundle = await connection.store('BundleEntity', { name: 'Some New Bundle', googleDriveId: 'SuperId' })
      bundle.resources = []

      expect(await connection.getAllInstruments()).toHaveLength(1)

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

      const storedResource = await ResourceRepository.save(bundle, resource)
      resource.id = storedResource.id

      expect(storedResource).toEqual(resource)

      expect(await connection.getAllInstruments()).toHaveLength(3)
    })
  })
})