import { getManager } from 'typeorm'
import { ResourceEntity } from './entity/ResourceEntity'
import Resource from '../domain/Resource'
import { mapFromResourceEntity } from './EntityMapper'

export default class ResourceRepository {
  static async findOne(id: number): Promise<Resource> {
    const resourceEntity = await getManager().getRepository(ResourceEntity).findOne(id)

    if (resourceEntity) {
      return mapFromResourceEntity(resourceEntity)
    } else {
      throw new Error(`Resource with id ${id} was not found`)
    }
  }

  static async delete(id: number): Promise<void> {
    const resourceRepository = getManager().getRepository(ResourceEntity)
    const resource = await resourceRepository.findOne(id)

    if (!resource) {
      throw new Error('Resource was not found')
    }

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