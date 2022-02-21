import { getManager } from 'typeorm'
import { BundleEntity } from './entity/BundleEntity'
import { mapFromBundleEntity, mapToBundleEntity } from './EntityMapper'
import Bundle from '../domain/Bundle'

export default class BundleRepository {
  static async findAll(): Promise<Bundle[]> {
    const bundleEntities = await getManager().getRepository(BundleEntity).find()
    return bundleEntities.map(mapFromBundleEntity)
  }

  static async findOne(id: number): Promise<Bundle> {
    const bundleEntity = await getManager().getRepository(BundleEntity).findOne(id)

    if (bundleEntity) {
      return mapFromBundleEntity(bundleEntity)
    } else {
      throw new Error(`Bundle with id ${id} was not found`)
    }
  }

  static async save(bundle: Bundle): Promise<Bundle> {
    const bundleEntity = mapToBundleEntity(bundle)
    const storedEntity = await getManager().getRepository(BundleEntity).save(bundleEntity)

    return mapFromBundleEntity(storedEntity)
  }
}