import { BundleEntity } from './entity/BundleEntity'
import { mapFromEntity, mapToEntity } from './EntityMapper'
import Bundle from '../domain/Bundle'
import Resource from '../domain/Resource'
import { ResourceEntity } from './entity/ResourceEntity'
import { AuthorEntity } from './entity/AuthorEntity'
import { ComposerEntity } from './entity/ComposerEntity'
import { ArrangerEntity } from './entity/ArrangerEntity'
import { InstrumentEntity } from './entity/InstrumentEntity'

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
    ['First Composer', 'Second Composer'],
    ['First Arranger', 'Second Arranger'],
    ['Piano', 'Violin', 'Trumpet'],
  )
  const expectedBundle = new Bundle(32, 'Some super bundle', 'SuperDriveId', [expectedResource])
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
    undefined,
    expectedResource.composers?.map(composer => new ComposerEntity(0, composer)),
    expectedResource.arrangers?.map(arranger => new ArrangerEntity(0, arranger)),
    expectedResource.instruments?.map(instrument => new InstrumentEntity(0, instrument)),
  )
  const bundleEntity = new BundleEntity(
    expectedBundle.id,
    expectedBundle.name,
    expectedBundle.googleDriveId,
    [resourceEntity]
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