import { BundleEntity } from './BundleEntity'
import Bundle from '@shared/Bundle'

describe('BundleEntity', () => {
  describe('toDomain', () => {
    it('should return the domain object', () => {
      const expectedBundle: Bundle = { id: 32, name: 'Some Super Bundle' }
      const bundleEntity = new BundleEntity(expectedBundle.id, expectedBundle.name)

      expect(bundleEntity.toDomain()).toEqual(expectedBundle)
    })
  })
})