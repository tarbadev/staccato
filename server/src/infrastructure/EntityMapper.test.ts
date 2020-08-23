import { BundleEntity } from './BundleEntity'
import { mapBundleEntity } from './EntityMapper'
import Bundle from '../application/Bundle'
import Resource from '../application/Resource'
import { ResourceEntity } from './ResourceEntity'

describe('BundleEntity', () => {
  describe('toDomain', () => {
    it('should return the domain object with resources', () => {
      const expectedResource = new Resource(50, 'Resource Title That Matters', 'AnotherDriveId')
      const expectedBundle = new Bundle(32, 'Some super bundle', 'SuperDriveId', [expectedResource])
      const bundleEntity = new BundleEntity(
        expectedBundle.id,
        expectedBundle.name,
        expectedBundle.googleDriveId,
      )
      const resourceEntity = new ResourceEntity(expectedResource.id, expectedResource.title, expectedResource.googleDriveId, bundleEntity)
      bundleEntity.resources = [resourceEntity]

      expect(mapBundleEntity(bundleEntity)).toEqual(expectedBundle)
    })

    it('should return the domain object without resources', () => {
      const expectedBundle = new Bundle(32, 'Some super bundle', 'SuperDriveId')
      const bundleEntity = new BundleEntity(
        expectedBundle.id,
        expectedBundle.name,
        expectedBundle.googleDriveId,
      )

      expect(mapBundleEntity(bundleEntity)).toEqual(expectedBundle)
    })
  })
})