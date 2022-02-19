import ResourceRepository from './ResourceRepository'
import connection from '@shared/DbHelperUnit'
import { ResourceEntity } from './entity/ResourceEntity'

describe('ResourceRepository', () => {
  beforeAll(() => connection.create())
  afterAll(() => connection.close())
  beforeEach(() => connection.clear())

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