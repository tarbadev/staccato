import Bundle from '@shared/Bundle'
import { getManager } from 'typeorm'
import { BundleEntity } from './BundleEntity'

export default class BundleRepository {
  static async findAll(): Promise<Bundle[]> {
    const bundleEntities = await getManager().getRepository(BundleEntity).find()
    return bundleEntities.map(bundleEntity => bundleEntity.toDomain())
  }
}