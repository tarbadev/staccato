import Bundle from '@shared/Bundle'
import { getManager } from 'typeorm'
import { BundleEntity } from './BundleEntity'

export default class BundleRepository {
  static async findAll(): Promise<Bundle[]> {
    const bundleEntities = await getManager().getRepository(BundleEntity).find()
    return bundleEntities.map(bundleEntity => bundleEntity.toDomain())
  }

  static async findOne(id: number): Promise<Bundle> {
    const bundleEntity = await getManager().getRepository(BundleEntity).findOne(id)

    if (bundleEntity) {
      return bundleEntity.toDomain()
    } else {
      throw new Error(`Bundle with id ${id} was not found`)
    }
  }
}