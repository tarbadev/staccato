import { BundleEntity } from './BundleEntity'
import { mapBundleEntity } from './EntityMapper'
import Bundle from '../application/Bundle'

describe('BundleEntity', () => {
  describe('toDomain', () => {
    it('should return the domain object', () => {
      const expectedBundle: Bundle = { id: 32, name: 'Some Super Bundle', googleDriveId: 'SuperId' }
      const bundleEntity = new BundleEntity(expectedBundle.id, expectedBundle.name, expectedBundle.googleDriveId)

      expect(mapBundleEntity(bundleEntity)).toEqual(expectedBundle)
    })
  })
})