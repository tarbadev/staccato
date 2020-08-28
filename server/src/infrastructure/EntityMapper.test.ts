import { BundleEntity } from './entity/BundleEntity'
import { mapFromEntity, mapToEntity } from './EntityMapper'
import Bundle from '../application/Bundle'
import Resource from '../application/Resource'
import { ResourceEntity } from './entity/ResourceEntity'
import { AuthorEntity } from './entity/AuthorEntity'

describe('BundleEntity', () => {
  const expectedResource = new Resource(
    50,
    'Resource Title That Matters',
    'video',
    'AnotherDriveId',
    '/path/to/resource/file',
    'https://example/com',
    [
      'First Author',
      'Second Author',
    ],
    'Some Album',
    'playback',
  )
  const expectedBundle = new Bundle(32, 'Some super bundle', 'SuperDriveId', [expectedResource])
  const bundleEntity = new BundleEntity(
    expectedBundle.id,
    expectedBundle.name,
    expectedBundle.googleDriveId,
  )
  const resourceEntity = new ResourceEntity(
    expectedResource.id,
    expectedResource.title,
    expectedResource.type,
    expectedResource.googleDriveId,
    expectedResource.googleDriveLink,
    expectedResource.source,
    expectedResource.authors?.map(author => new AuthorEntity(0, author)),
    expectedResource.album,
    expectedResource.audioType,
  )

  describe('toDomain', () => {
    it('should return the domain object with resources', () => {
      bundleEntity.resources = [resourceEntity]

      expect(mapFromEntity(bundleEntity)).toEqual(expectedBundle)
    })

    it('should return the domain object without resources', () => {
      const expectedBundle = new Bundle(32, 'Some super bundle', 'SuperDriveId')
      const bundleEntity = new BundleEntity(
        expectedBundle.id,
        expectedBundle.name,
        expectedBundle.googleDriveId,
      )

      expect(mapFromEntity(bundleEntity)).toEqual(expectedBundle)
    })
  })

  describe('toEntity', () => {
    it('should return the entity object with resources', () => {
      expect(mapToEntity(expectedBundle)).toEqual(bundleEntity)
    })
  })
})