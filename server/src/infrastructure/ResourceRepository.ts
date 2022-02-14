import { getManager } from 'typeorm'
import { ResourceEntity } from './entity/ResourceEntity'

export default class ResourceRepository {
  static async delete(id: number): Promise<void> {
    const resourceRepository = getManager().getRepository(ResourceEntity)

    const resource: ResourceEntity = (await resourceRepository.findOne(id))!
    const resourceWithoutRelationships: ResourceEntity = {
      ...resource,
      bundle: resource.bundle,
      authors: [],
      arrangers: [],
      composers: [],
      instruments: [],
    }

    await resourceRepository.save(resourceWithoutRelationships)
    await resourceRepository.delete(id)
  }
}