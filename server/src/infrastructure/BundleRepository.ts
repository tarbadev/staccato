import Bundle from '@shared/Bundle'
import { getManager } from 'typeorm'
import { BundleEntity } from './BundleEntity'
import { mapBundleEntity } from './EntityMapper'

export default class BundleRepository {
  static async findAll(): Promise<Bundle[]> {
    const bundleEntities = await getManager().getRepository(BundleEntity).find()
    return bundleEntities.map(mapBundleEntity)
  }

  static async findOne(id: number): Promise<Bundle> {
    const bundleEntity = await getManager().getRepository(BundleEntity).findOne(id)

    if (bundleEntity) {
      return mapBundleEntity(bundleEntity)
    } else {
      throw new Error(`Bundle with id ${id} was not found`)
    }
  }

  static async save(bundle: Bundle): Promise<Bundle> {
    const storedEntity = await getManager().getRepository(BundleEntity).save(bundle)
    return mapBundleEntity(storedEntity)
  }
}